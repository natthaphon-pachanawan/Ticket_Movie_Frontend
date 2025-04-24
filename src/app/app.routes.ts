import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminMoviesComponent }      from './admin/admin-movies/admin-movies.component';
import { AdminMovieFormComponent }   from './admin/admin-movie-form/admin-movie-form.component';
import { AdminCinemasComponent }     from './admin/admin-cinemas/admin-cinemas.component';
import { AdminCinemaFormComponent }  from './admin/admin-cinema-form/admin-cinema-form.component';
import { AdminRoomsComponent }       from './admin/admin-rooms/admin-rooms.component';
import { AdminRoomFormComponent }    from './admin/admin-room-form/admin-room-form.component';
import { AdminScreeningsComponent }  from './admin/admin-screenings/admin-screenings.component';
import { AdminScreeningFormComponent } from './admin/admin-screening-form/admin-screening-form.component';
import { AdminSeatsComponent }       from './admin/admin-seats/admin-seats.component';
import { AdminSeatFormComponent }    from './admin/admin-seat-form/admin-seat-form.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { MovieShowtimesComponent } from './pages/movie-showtimes/movie-showtimes.component';
import { BookingCreateComponent } from './pages/booking-create/booking-create.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PaymentAndSlipComponent } from './pages/payment-page/payment-and-slip.component';
import { AdminSlipsComponent } from './admin/admin-slips/admin-slips.component';
import { AdminReportsComponent } from './admin/admin-reports/admin-reports.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movies/:id/showtimes', component: MovieShowtimesComponent },
  { path: 'booking/create', component: BookingCreateComponent, canActivate: [AuthGuard] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: MyTicketsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  // --- Admin CRUD ---
  {path: 'admin/movies', component: AdminMoviesComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/movies/create', component: AdminMovieFormComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/movies/edit/:id', component: AdminMovieFormComponent, canActivate: [AuthGuard, AdminGuard]},

  {path: 'admin/cinemas', component: AdminCinemasComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/cinemas/create', component: AdminCinemaFormComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/cinemas/edit/:id', component: AdminCinemaFormComponent, canActivate: [AuthGuard, AdminGuard]},

  {path: 'admin/rooms', component: AdminRoomsComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/rooms/create', component: AdminRoomFormComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/rooms/edit/:id', component: AdminRoomFormComponent, canActivate: [AuthGuard, AdminGuard]},

  {path: 'admin/screenings', component: AdminScreeningsComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/screenings/create', component: AdminScreeningFormComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/screenings/edit/:id', component: AdminScreeningFormComponent, canActivate: [AuthGuard, AdminGuard]},

  {path: 'admin/seats', component: AdminSeatsComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/seats/create', component: AdminSeatFormComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'admin/seats/edit/:id', component: AdminSeatFormComponent, canActivate: [AuthGuard, AdminGuard]},

  {path: 'admin/slips', component: AdminSlipsComponent, canActivate: [AuthGuard, AdminGuard]},

  {path: 'admin/reports', component: AdminReportsComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: 'payment', component: PaymentAndSlipComponent, canActivate:[AuthGuard] },

  
];

