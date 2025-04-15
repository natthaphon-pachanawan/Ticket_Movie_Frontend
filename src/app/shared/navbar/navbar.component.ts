import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
