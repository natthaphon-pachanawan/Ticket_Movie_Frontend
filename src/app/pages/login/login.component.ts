import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService    // inject AuthService
  ) { }

  onSubmit() {
    this.http.post<{ data: { token: string, user: any } }>(
      'http://localhost:8000/api/auth/login',
      { login: this.email, password: this.password }
    ).subscribe({
      next: res => {
        // เก็บ token + user
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // ถ้าเป็น admin → ไป /admin, ไม่งั้น → หน้าแรก
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        this.error = 'เข้าสู่ระบบไม่สำเร็จ';
        console.error(err);
      }
    });
  }
}
