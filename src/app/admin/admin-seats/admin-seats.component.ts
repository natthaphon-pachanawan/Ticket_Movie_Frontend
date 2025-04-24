import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Room {
  id: number;
  room_name: string;
  cinema: {
    id: number;
    name: string;
  }
}

interface Seat {
  id: number;
  screening_room_id: number;
  seat_number: string;
  row: number | string;
  column: number | string;
  seat_type: string;
  is_active: boolean;
  // is_reserved comes from API but we ignore for admin CRUD
}

@Component({
  standalone: true,
  selector: 'app-admin-seats',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-seats.component.html',
  styleUrls: ['./admin-seats.component.scss']
})
export class AdminSeatsComponent implements OnInit {
  rooms: Room[] = [];
  selectedRoomId: number | null = null;
  seats: Seat[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // โหลด list ของ Screening Rooms
    this.http.get<{ data: Room[] }>('http://localhost:8000/api/screening-rooms/list')
      .subscribe(res => this.rooms = res.data);
  }

  onRoomChange() {
    if (!this.selectedRoomId) {
      this.seats = [];
      return;
    }
    // เรียก API ดึงที่นั่งของห้อง เลือกใช้ screening_id=0 เพื่อให้ is_reserved = false
    this.http
      .get<{ data: Seat[] }>(
        `http://localhost:8000/api/seats/list/${this.selectedRoomId}?screening_id=0`
      )
      .subscribe(res => this.seats = res.data);
  }

  goCreate() {
    if (!this.selectedRoomId) {
      alert('กรุณาเลือกห้องก่อน');
      return;
    }
    this.router.navigate(['/admin/seats/create'], {
      queryParams: { room_id: this.selectedRoomId }
    });
  }

  goEdit(seat: Seat) {
    this.router.navigate(['/admin/seats/edit', seat.id], {
      queryParams: { room_id: seat.screening_room_id }
    });
  }

  delete(seat: Seat) {
    if (!confirm(`ลบที่นั่ง ${seat.seat_number}?`)) return;
    this.http
      .delete<{ success: string }>(`http://localhost:8000/api/seats/delete/${seat.id}`)
      .subscribe(() => this.onRoomChange());
  }
}
