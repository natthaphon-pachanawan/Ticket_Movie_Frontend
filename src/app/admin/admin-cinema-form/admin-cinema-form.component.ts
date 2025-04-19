import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-admin-cinema-form',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-cinema-form.component.html',
  styleUrls: ['./admin-cinema-form.component.scss']
})
export class AdminCinemaFormComponent implements OnInit {
  isEdit = false;
  cinema: any = {
    name: '',
    address: '',
    province_id: null,
    district_id: null,
    subdistrict_id: null,
    contact_phone: '',
    contact_email: ''
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
        .get<{ data: any }>(`http://localhost:8000/api/cinemas/detail/${id}`)
        .subscribe(res => this.cinema = res.data);
    }
  }

  save() {
    const payload = {
      name: this.cinema.name,
      address: this.cinema.address,
      province_id: this.cinema.province_id,
      district_id: this.cinema.district_id,
      subdistrict_id: this.cinema.subdistrict_id,
      contact_phone: this.cinema.contact_phone,
      contact_email: this.cinema.contact_email
    };

    const url = this.isEdit
      ? `http://localhost:8000/api/cinemas/update/${this.cinema.id}`
      : 'http://localhost:8000/api/cinemas/create';

    this.http.post(url, payload).subscribe(() => {
      this.router.navigate(['/admin/cinemas']);
    });
  }
}
