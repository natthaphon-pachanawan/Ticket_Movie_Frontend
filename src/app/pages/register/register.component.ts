import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form = {
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    gender: 'M',         // M หรือ F
    role_id: 2           // ผู้ใช้ทั่วไปใช้ role_id = 2
  };

  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:8000/api/auth/register', this.form)
      .subscribe({
        next: (res: any) => {
          alert('✅ สมัครสมาชิกสำเร็จ');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = '❌ สมัครไม่สำเร็จ: ' + (err.error?.message || 'เกิดข้อผิดพลาด');
          console.error(err);
        }
      });
  }
}
