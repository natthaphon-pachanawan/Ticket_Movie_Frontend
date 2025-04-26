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
  // เพิ่ม flag เพื่อบอกว่าเวลาผ่านไปแล้ว
  isPast?:           boolean;
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

  // เก็บรอบฉายที่ยังไม่ถึงวันก่อนหน้าเท่านั้น
  allShowtimes: Showtime[] = [];
  showtimesByDate: { [date: string]: Showtime[] } = {};

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
        const now       = new Date();
        const todayZero = new Date(now);
        todayZero.setHours(0,0,0,0);

        // 1) กรองเอารอบฉายที่วันที่ >= วันนี้
        this.allShowtimes = res.data
          .filter(s => new Date(s.screening_datetime) >= todayZero)
          .map(s => ({
            ...s,
            // isPast = รอบฉายก่อนเวลาปัจจุบันหรือไม่
            isPast: new Date(s.screening_datetime) < now
          }));

        // 2) เตรียมรายชื่อจังหวัด
        this.provinces = Array.from(new Set(
          this.allShowtimes.map(s => s.screening_room.cinema.province.name_th)
        )).sort();

        this.applyFilters();
      });
  }

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

  applyFilters() {
    const filtered = this.allShowtimes.filter(s => {
      const c = s.screening_room.cinema;
      return (
        (!this.selectedProvince || c.province.name_th === this.selectedProvince) &&
        (!this.selectedAmphoe   || c.district.name_th   === this.selectedAmphoe) &&
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
    // ดึง key แล้วเรียงจากน้อยไปมาก (YYYY-MM-DD)
    const dates = Object.keys(this.showtimesByDate).sort();
    const today = new Date().toISOString().slice(0, 10);
    // ถ้าในลิสต์มีวันนี้ ให้ย้ายไปหน้าแรก
    const idx = dates.indexOf(today);
    if (idx > -1) {
      dates.splice(idx, 1);
      dates.unshift(today);
    }
    return dates;
  }
}
