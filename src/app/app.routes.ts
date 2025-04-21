import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
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
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard], children: [
      { path: '', redirectTo: 'movies', pathMatch: 'full' },
      { path: 'movies', component: AdminMoviesComponent },
      // Movies
      { path: 'movies',         component: AdminMoviesComponent },
      { path: 'movies/create',  component: AdminMovieFormComponent },
      { path: 'movies/edit/:id',component: AdminMovieFormComponent },
      // Cinemas
      { path: 'cinemas',           component: AdminCinemasComponent },
      { path: 'cinemas/create',    component: AdminCinemaFormComponent },
      { path: 'cinemas/edit/:id',  component: AdminCinemaFormComponent },
      // Rooms
      { path: 'rooms',           component: AdminRoomsComponent },
      { path: 'rooms/create',    component: AdminRoomFormComponent },
      { path: 'rooms/edit/:id',  component: AdminRoomFormComponent },
      // Screenings
      { path: 'screenings',             component: AdminScreeningsComponent },
      { path: 'screenings/create',      component: AdminScreeningFormComponent },
      { path: 'screenings/edit/:id',    component: AdminScreeningFormComponent },
      // Seats
      { path: 'seats',               component: AdminSeatsComponent },
      { path: 'seats/create',        component: AdminSeatFormComponent },
      { path: 'seats/edit/:id',      component: AdminSeatFormComponent },
      // Slips
      { path: 'slips',               component: AdminSlipsComponent },
    ]
  },
  { path: 'payment', component: PaymentAndSlipComponent, canActivate:[AuthGuard] },
  
];

