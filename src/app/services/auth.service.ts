import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'token';
  private userKey = 'user';

  constructor() {}

  // ✅ ตรวจว่ามี token หรือไม่
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // ✅ ดึง token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // ✅ ดึงข้อมูลผู้ใช้
  getUser(): any {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  // ✅ ลบ token + user (ออกจากระบบ)
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return !!user && user.role?.role_name === 'Admin';
  }
}
