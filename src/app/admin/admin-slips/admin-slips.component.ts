import { Component, OnInit } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface User      { username: string }
interface Movie     { title: string }
interface Screening { movie?: Movie; screening_datetime: string }
interface Booking   { user?: User; screening?: Screening; total_price: number }

interface Slip {
  id: number;
  booking_id: number;
  amount: number;
  payment_status: 'pending' | 'confirmed' | 'rejected';
  payment_date: string | null;
  slip_image_url: string;
  booking?: Booking;
}

@Component({
  standalone: true,
  selector: 'app-admin-slips',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-slips.component.html',
  styleUrls: ['./admin-slips.component.scss']
})
export class AdminSlipsComponent implements OnInit {
  slips: Slip[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.http.get<{ data: Slip[] }>('http://localhost:8000/api/slips/list')
      .subscribe(res => {
        // แสดงเฉพาะ pending
        this.slips = res.data.filter(s => s.payment_status === 'pending');
        this.loading = false;
      }, () => {
        this.loading = false;
        alert('❌ โหลดข้อมูลไม่สำเร็จ');
      });
  }

  imgSrc(s: Slip) {
    return `http://localhost:8000/storage/${s.slip_image_url}`;
  }

  approve(s: Slip) { this.changeStatus(s, 'confirmed'); }
  reject (s: Slip) { this.changeStatus(s, 'rejected'); }

  private changeStatus(s: Slip, status: 'confirmed' | 'rejected') {
    if (!confirm(`เปลี่ยนสถานะเป็น ${status}?`)) return;
    const body = {
      payment_status: status,
      payment_date:  new Date().toISOString().slice(0,19).replace('T',' ')
    };
    this.http.post(
      `http://localhost:8000/api/slips/update/${s.id}`,
      body
    ).subscribe(() => this.load());
  }

  remove(s: Slip) {
    if (!confirm('ลบสลิปนี้?')) return;
    this.http.delete(`http://localhost:8000/api/slips/delete/${s.id}`)
      .subscribe(() => this.load());
  }
}
