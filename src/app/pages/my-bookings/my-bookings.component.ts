import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-my-bookings',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // เปลี่ยน URL
    this.http.get<any>('http://localhost:8000/api/bookings/current')
      .subscribe(res => this.bookings = res.data ?? res);
  }
  cancel(b: any) {
    if (!confirm('ยืนยันยกเลิก?')) return;
    this.http.post(`http://localhost:8000/api/bookings/cancel/${b.id}`, {})
      .subscribe(() => this.ngOnInit());
  }



}
