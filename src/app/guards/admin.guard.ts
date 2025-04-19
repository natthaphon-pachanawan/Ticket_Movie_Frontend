import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getUser();
    if (user?.role?.role_name === 'Admin') {
      return true;
    }
    // ไม่ใช่ admin → กลับหน้าแรก
    this.router.navigate(['/']);
    return false;
  }
}
