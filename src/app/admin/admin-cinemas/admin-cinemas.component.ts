import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Cinema {
  id: number;
  name: string;
  address: string;
  province_id: number;
  district_id: number;
  subdistrict_id: number;
  contact_phone?: string;
  contact_email?: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-cinemas',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-cinemas.component.html',
  styleUrls: ['./admin-cinemas.component.scss']
})
export class AdminCinemasComponent implements OnInit {
  cinemas: Cinema[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCinemas();
  }

  loadCinemas() {
    this.http
      .get<{ data: Cinema[] }>('http://localhost:8000/api/cinemas/list')
      .subscribe(res => this.cinemas = res.data);
  }

  goCreate() {
    this.router.navigate(['/admin/cinemas/create']);
  }

  goEdit(id: number) {
    this.router.navigate(['/admin/cinemas/edit', id]);
  }

  delete(id: number) {
    if (!confirm('ลบโรงภาพยนตร์นี้?')) return;
    this.http
      .delete<{ success: string }>(`http://localhost:8000/api/cinemas/delete/${id}`)
      .subscribe(() => this.loadCinemas());
  }
}
