import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-admin-room-form',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-room-form.component.html',
  styleUrls: ['./admin-room-form.component.scss']
})
export class AdminRoomFormComponent implements OnInit {
  isEdit = false;
  room: any = {
    cinema_id: null,
    room_name: '',
    seat_capacity: null,
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http
        .get<{ data: any }>(`http://localhost:8000/api/screening-rooms/detail/${id}`)
        .subscribe(res => this.room = res.data);
    }
  }

  save() {
    const payload = {
      cinema_id: this.room.cinema_id,
      room_name: this.room.room_name,
      seat_capacity: this.room.seat_capacity,
      description: this.room.description
    };

    const url = this.isEdit
      ? `http://localhost:8000/api/screening-rooms/update/${this.room.id}`
      : 'http://localhost:8000/api/screening-rooms/create';

    this.http.post(url, payload).subscribe(() => {
      this.router.navigate(['/admin/rooms']);
    });
  }
}
