import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Screening {
  id: number;
  movie: { id: number; title: string };
  screening_room: {
    id: number;
    room_name: string;
    cinema: { id: number; name: string };
  };
  screening_datetime: string;
  price: number;
}

@Component({
  standalone: true,
  selector: 'app-admin-screenings',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-screenings.component.html',
  styleUrls: ['./admin-screenings.component.scss']
})
export class AdminScreeningsComponent implements OnInit {
  screenings: Screening[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadScreenings();
  }

  loadScreenings() {
    this.http
      .get<{ data: Screening[] }>('http://localhost:8000/api/screenings/list')
      .subscribe(res => this.screenings = res.data);
  }

  goCreate() {
    this.router.navigate(['/admin/screenings/create']);
  }

  goEdit(id: number) {
    this.router.navigate(['/admin/screenings/edit', id]);
  }

  delete(id: number) {
    if (!confirm('ลบรอบฉาย ID ' + id + ' ใช่หรือไม่?')) return;
    this.http
      .delete<{ success: string }>(`http://localhost:8000/api/screenings/delete/${id}`)
      .subscribe(() => this.loadScreenings());
  }
}
