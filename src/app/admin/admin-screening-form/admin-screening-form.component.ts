import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Movie    { id: number; title: string }
interface Room     { id: number; room_name: string }
interface Cinema   { id: number; name: string }

@Component({
  standalone: true,
  selector: 'app-admin-screening-form',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-screening-form.component.html',
  styleUrls: ['./admin-screening-form.component.scss']
})
export class AdminScreeningFormComponent implements OnInit {
  isEdit = false;
  screeningId!: number;
  screening = {
    movie_id: null as number|null,
    screening_room_id: null as number|null,
    screening_datetime: '',
    price: null as number|null
  };

  movies: Movie[] = [];
  rooms: { id: number, room_name: string, cinema: Cinema }[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // โหลด dropdown data
    this.http.get<{ data: Movie[] }>('http://localhost:8000/api/movies/list')
      .subscribe(res => this.movies = res.data);
    this.http.get<{ data: any[] }>('http://localhost:8000/api/screening-rooms/list')
      .subscribe(res => this.rooms = res.data);

    // ตรวจ edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.screeningId = +id;
      this.http
        .get<{ data: any }>(`http://localhost:8000/api/screenings/detail/${id}`)
        .subscribe(res => {
          const d = res.data;
          this.screening = {
            movie_id:           d.movie.id,
            screening_room_id:  d.screening_room.id,
            screening_datetime: d.screening_datetime.replace(' ', 'T'),
            price:              d.price
          };
        });
    }
  }

  save() {
    // แปลง ISO-String ให้เป็น format Y-m-d H:i:s
    const dt = new Date(this.screening.screening_datetime);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatted = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())} `
                    + `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;

    const payload = {
      movie_id:           this.screening.movie_id,
      screening_room_id:  this.screening.screening_room_id,
      screening_datetime: formatted,
      price:              this.screening.price
    };

    const url = this.isEdit
      ? `http://localhost:8000/api/screenings/update/${this.screeningId}`
      : 'http://localhost:8000/api/screenings/create';

    this.http.post(url, payload).subscribe(() => {
      this.router.navigate(['/admin/screenings']);
    });
  }
}
