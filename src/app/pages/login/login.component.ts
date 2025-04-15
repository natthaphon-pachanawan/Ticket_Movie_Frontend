import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post<{ data: { token: string, user: any } }>('http://localhost:8000/api/auth/login', {
      login: this.email,  // ✅ เปลี่ยนชื่อฟิลด์จาก email → login
      password: this.password,
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = 'เข้าสู่ระบบไม่สำเร็จ';
        console.error(err);
      }
    });
  }  
}
