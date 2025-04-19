import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-admin-seat-form',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-seat-form.component.html',
  styleUrls: ['./admin-seat-form.component.scss']
})
export class AdminSeatFormComponent implements OnInit {
  isEdit = false;
  seatId!: number;
  roomId!: number;

  seat: any = {
    screening_room_id: null,
    seat_number: '',
    row: null,
    column: null,
    seat_type: 'regular',
    is_active: true
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // ดึง room_id จาก query params
    const q = this.route.snapshot.queryParamMap;
    this.roomId = +(q.get('room_id') || 0);
    this.seat.screening_room_id = this.roomId;

    // ตรวจ edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.seatId = +id;
      // โหลดข้อมูลที่นั่งผ่าน ScreeningRoomController.show
      this.http
        .get<{ data: any }>(`http://localhost:8000/api/screening-rooms/detail/${this.roomId}`)
        .subscribe(res => {
          const found = res.data.seats.find((s: any) => s.id === this.seatId);
          if (found) {
            this.seat = { ...found };
          }
        });
    }
  }

  save() {
    const payload = {
      screening_room_id: this.seat.screening_room_id,
      seat_number:       this.seat.seat_number,
      row:               this.seat.row,
      column:            this.seat.column,
      seat_type:         this.seat.seat_type,
      is_active:         this.seat.is_active
    };

    const url = this.isEdit
      ? `http://localhost:8000/api/seats/update/${this.seatId}`
      : 'http://localhost:8000/api/seats/create';

    this.http.post(url, payload).subscribe(() => {
      this.router.navigate(['/admin/seats'], {
        queryParams: { room_id: this.roomId }
      });
    });
  }
}
