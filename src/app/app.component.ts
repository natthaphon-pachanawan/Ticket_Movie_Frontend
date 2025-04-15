import { Component } from '@angular/core';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Ticket_Movie_Frontend';
}
