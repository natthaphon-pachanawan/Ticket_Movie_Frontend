import { Component, OnInit }     from '@angular/core';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Province   { id: number; name_th: string }
interface District   { id: number; name_th: string }
interface SubDistrict{ id: number; name_th: string }

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

  provinces: Province[]    = [];
  districts: District[]    = [];
  subdistricts: SubDistrict[] = [];

  private baseUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) โหลดจังหวัด
    this.http
      .get<{ data: Province[] }>(`${this.baseUrl}/provinces/list`)
      .subscribe({
        next: res => this.provinces = res.data,
        error: err => console.error('ไม่สามารถโหลดจังหวัดได้', err)
      });

    // 2) ถ้ามี id ให้ preload ข้อมูล และกรองอำเภอ/ตำบล
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.http
        .get<{ data: any }>(`${this.baseUrl}/cinemas/detail/${id}`)
        .subscribe(res => {
          this.cinema = res.data;
          this.onProvinceChange();
          this.onDistrictChange();
        });
    }
  }

  /** เมื่ิอเลือกจังหวัด ให้โหลดอำเภอ */
  onProvinceChange(): void {
    this.districts = [];
    this.subdistricts = [];
    if (!this.cinema.province_id) { return; }

    this.http
      .get<{ data: District[] }>(
        `${this.baseUrl}/districts/list?province_id=${this.cinema.province_id}`
      )
      .subscribe({
        next: res => this.districts = res.data,
        error: err => console.error('ไม่สามารถโหลดอำเภอได้', err)
      });
  }

  /** เมื่อเลือกอำเภอ ให้โหลดตำบล */
  onDistrictChange(): void {
    this.subdistricts = [];
    if (!this.cinema.district_id) { return; }

    this.http
      .get<{ data: SubDistrict[] }>(
        `${this.baseUrl}/subdistricts/list?district_id=${this.cinema.district_id}`
      )
      .subscribe({
        next: res => this.subdistricts = res.data,
        error: err => console.error('ไม่สามารถโหลดตำบลได้', err)
      });
  }

  /** บันทึกข้อมูล create / update */
  save(): void {
    const payload = {
      name:            this.cinema.name,
      address:         this.cinema.address,
      province_id:     this.cinema.province_id,
      district_id:     this.cinema.district_id,
      subdistrict_id:  this.cinema.subdistrict_id,
      contact_phone:   this.cinema.contact_phone,
      contact_email:   this.cinema.contact_email
    };
    const url = this.isEdit
      ? `${this.baseUrl}/cinemas/update/${this.cinema.id}`
      : `${this.baseUrl}/cinemas/create`;

    this.http.post(url, payload).subscribe(() => {
      this.router.navigate(['/admin/cinemas']);
    });
  }
}
