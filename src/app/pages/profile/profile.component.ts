import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  error = '';
  success = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8000/api/user/profile').subscribe({
      next: (res) => {
        this.user = res.data ?? res;
      },
      error: (err) => {
        this.error = 'ไม่สามารถโหลดข้อมูลผู้ใช้';
        console.error(err);
      }
    });
  }

  updateProfile() {
    this.http.post('http://localhost:8000/api/user/profile/update', this.user).subscribe({
      next: () => this.success = 'บันทึกข้อมูลสำเร็จ ✅',
      error: (err) => {
        this.error = 'บันทึกข้อมูลไม่สำเร็จ ❌';
        console.error(err);
      }
    });
  }
}
