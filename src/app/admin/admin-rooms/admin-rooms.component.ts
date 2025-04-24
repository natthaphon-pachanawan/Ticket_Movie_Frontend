import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface ScreeningRoom {
  id: number;
  cinema_id: number;
  room_name: string;
  seat_capacity: number;
  description?: string;
  cinema: {           // เพิ่งเพิ่มตรงนี้
    id: number;
    name: string;
    // ถ้าจำเป็นต้องใช้ข้อมูลอื่นก็เติมได้
  };
}

@Component({
  standalone: true,
  selector: 'app-admin-rooms',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-rooms.component.html',
  styleUrls: ['./admin-rooms.component.scss']
})
export class AdminRoomsComponent implements OnInit {
  rooms: ScreeningRoom[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.http
      .get<{ data: ScreeningRoom[] }>('http://localhost:8000/api/screening-rooms/list')
      .subscribe(res => this.rooms = res.data);
  }

  goCreate() {
    this.router.navigate(['/admin/rooms/create']);
  }

  goEdit(id: number) {
    this.router.navigate(['/admin/rooms/edit', id]);
  }

  delete(id: number) {
    if (!confirm('ลบห้องฉายนี้?')) return;
    this.http
      .delete<{ success: string }>(`http://localhost:8000/api/screening-rooms/delete/${id}`)
      .subscribe(() => this.loadRooms());
  }
}
