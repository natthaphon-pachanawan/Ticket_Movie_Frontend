import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { MovieShowtimesComponent } from './pages/movie-showtimes/movie-showtimes.component';
import { BookingCreateComponent } from './pages/booking-create/booking-create.component';
import { UploadSlipComponent } from './pages/upload-slip/upload-slip.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { ProfileComponent } from './pages/profile/profile.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movies/:id/showtimes', component: MovieShowtimesComponent },
  { path: 'booking/create', component: BookingCreateComponent, canActivate: [AuthGuard] },
  { path: 'upload-slip', component: UploadSlipComponent, canActivate: [AuthGuard] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: MyTicketsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  
];

