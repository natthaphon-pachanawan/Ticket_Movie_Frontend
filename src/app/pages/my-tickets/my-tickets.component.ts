import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
    this.http.get<any>('http://localhost:8000/api/tickets/my').subscribe({
      next: res => {
        const now = new Date().getTime();

        // กรองเฉพาะตั๋วที่ยังไม่หมดเวลาฉาย
        this.tickets = (res.data ?? res).filter((ticket: any) => {
          const screeningTime = new Date(ticket.screening.screening_datetime).getTime();
          const duration = ticket.screening.movie.duration * 60 * 1000; // นาที -> ms
          const endTime = screeningTime + duration;

          return now <= endTime; // แสดงเฉพาะที่ยังไม่หมดเวลาฉาย
        });
      },
      error: err => {
        alert('ไม่สามารถโหลดข้อมูลตั๋วได้');
        console.error(err);
      }
    });
  }

}
