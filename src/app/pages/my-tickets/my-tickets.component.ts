// src/app/pages/my-tickets/my-tickets.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { HttpClient }        from '@angular/common/http';
import { RouterModule }      from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-my-tickets',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss']
})
export class MyTicketsComponent implements OnInit {
  tickets: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<{ data: any[] }>('http://localhost:8000/api/tickets/my').subscribe({
      next: res => {
        const now = Date.now();

        this.tickets = (res.data ?? [])
          // กรองเฉพาะตั๋วยังไม่หมดเวลา
          .filter((t: any) => {
            const startMs    = new Date(t.screening.screening_datetime).getTime();
            const durationMs = t.screening.movie.duration * 60_000;
            return now <= startMs + durationMs;
          })
          // สร้าง alias และ status text
          .map((t: any) => ({
            ...t,
            screeningRoom: t.screening.screening_room,
            statusText:    t.status === 'active' ? 'ยังใช้ได้' : 'หมดอายุ'
          }));
      },
      error: err => {
        alert('ไม่สามารถโหลดข้อมูลตั๋วได้');
        console.error(err);
      }
    });
  }
}
