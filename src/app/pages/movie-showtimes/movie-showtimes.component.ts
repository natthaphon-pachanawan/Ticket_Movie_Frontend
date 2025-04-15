import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ import เพิ่ม!
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-movie-showtimes',
  standalone: true, // ✅ สำคัญ!
  imports: [
    CommonModule,      // ✅ สำหรับ *ngIf, *ngFor, date pipe
    RouterModule,      // ✅ ถ้าใช้ routerLink หรือ router.navigate
    HttpClientModule,  // ✅ ถ้าใช้ http ภายใน component (optional)
  ],
  templateUrl: './movie-showtimes.component.html',
  styleUrls: ['./movie-showtimes.component.scss']
}) 
export class MovieShowtimesComponent implements OnInit {
  movieId!: number;
  showtimesByDate: { [date: string]: any[] } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieId = +this.route.snapshot.paramMap.get('id')!;
    this.loadShowtimes();
  }

  loadShowtimes(): void {
    this.http
      .get<any>(`http://localhost:8000/api/screenings/filter/by-movie?movie_id=${this.movieId}`)
      .subscribe((res) => {
        const all = res.data ?? res; // ✅ ดึงจาก res.data
  
        // เคลียร์ก่อน
        this.showtimesByDate = {};
  
        for (let s of all) {
          const date = s.screening_datetime.slice(0, 10); // แยกวันที่
          if (!this.showtimesByDate[date]) {
            this.showtimesByDate[date] = [];
          }
          this.showtimesByDate[date].push(s);
        }
      });
  }  

  goToBooking(screeningId: number): void {
    this.router.navigate(['/booking/create'], { queryParams: { screening_id: screeningId } });
  }

  get showtimeDates(): string[] {
    return Object.keys(this.showtimesByDate);
  }
  
}
