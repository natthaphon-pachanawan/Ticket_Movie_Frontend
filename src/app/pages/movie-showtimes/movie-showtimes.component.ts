import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface CinemaLocation {
  name:       string;
  province:   { name_th: string };
  district:   { name_th: string };
  subdistrict:{ name_th: string };
}

interface Showtime {
  id:                 number;
  screening_datetime: string;
  price:              number;
  screening_room: {
    cinema:    CinemaLocation;
    room_name: string;
  };
}

@Component({
  standalone: true,
  selector: 'app-movie-showtimes',
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './movie-showtimes.component.html',
  styleUrls: ['./movie-showtimes.component.scss']
})
export class MovieShowtimesComponent implements OnInit {
  movieId!: number;

  // เก็บข้อมูลรอบฉายทั้งหมด (ก่อนกรอง)
  allShowtimes: Showtime[] = [];
  // จัดกลุ่มแยกตามวันที่ หลังกรอง
  showtimesByDate: { [date: string]: Showtime[] } = {};

  // ตัวกรองสถานที่
  provinces: string[] = [];
  amphoes:   string[] = [];
  tambons:   string[] = [];

  selectedProvince = '';
  selectedAmphoe   = '';
  selectedTambon   = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.movieId = +this.route.snapshot.paramMap.get('id')!;
    this.loadShowtimes();
  }

  private loadShowtimes(): void {
    this.http
      .get<{ data: Showtime[] }>(
        `http://localhost:8000/api/screenings/filter/by-movie?movie_id=${this.movieId}`
      )
      .subscribe(res => {
        // ชัดเจนว่า res.data คือ Showtime[]
        this.allShowtimes = res.data;

        // 1) เตรียมรายการชื่อจังหวัด
        this.provinces = Array.from(new Set(
          this.allShowtimes.map(s => s.screening_room.cinema.province.name_th)
        )).sort();

        // 2) เรียกกรองครั้งแรก (ยังไม่เลือกอะไร)
        this.applyFilters();
      });
  }

  /** เมื่อเปลี่ยนจังหวัด */
  onProvinceChange() {
    this.selectedAmphoe = '';
    this.selectedTambon = '';
    this.amphoes = Array.from(new Set(
      this.allShowtimes
        .filter(s => s.screening_room.cinema.province.name_th === this.selectedProvince)
        .map(s => s.screening_room.cinema.district.name_th)
    )).sort();
    this.tambons = [];
    this.applyFilters();
  }

  /** เมื่อเปลี่ยนอำเภอ */
  onAmphoeChange() {
    this.selectedTambon = '';
    this.tambons = Array.from(new Set(
      this.allShowtimes
        .filter(s =>
          s.screening_room.cinema.province.name_th === this.selectedProvince &&
          s.screening_room.cinema.district.name_th   === this.selectedAmphoe
        )
        .map(s => s.screening_room.cinema.subdistrict.name_th)
    )).sort();
    this.applyFilters();
  }

  /** กรอง ตาม province/amphoe/tambon และ จัดกลุ่มตามวัน */
  applyFilters() {
    const filtered = this.allShowtimes.filter(s => {
      const c = s.screening_room.cinema;
      return (
        (!this.selectedProvince || c.province.name_th === this.selectedProvince) &&
        (!this.selectedAmphoe   || c.district.name_th === this.selectedAmphoe) &&
        (!this.selectedTambon   || c.subdistrict.name_th === this.selectedTambon)
      );
    });

    this.showtimesByDate = {};
    for (let s of filtered) {
      const day = s.screening_datetime.slice(0, 10);
      if (!this.showtimesByDate[day]) {
        this.showtimesByDate[day] = [];
      }
      this.showtimesByDate[day].push(s);
    }
  }

  goToBooking(screeningId: number): void {
    this.router.navigate(['/booking/create'], {
      queryParams: { screening_id: screeningId }
    });
  }

  get showtimeDates(): string[] {
    return Object.keys(this.showtimesByDate);
  }
}
