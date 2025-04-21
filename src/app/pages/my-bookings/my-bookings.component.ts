import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient }      from '@angular/common/http';
import { forkJoin }        from 'rxjs';
import { map }             from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-my-bookings',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // 1) ให้ backend วิ่ง expireOldBookings() ใน history() เรียกก่อนดึง
    // 2) ดึงทั้ง current + history มา merge
    forkJoin({
      history: this.http.get<any>('http://localhost:8000/api/bookings/history'),
    }).pipe(
      map(({history}) => [
        ...(history.data ?? history).map((b:any) => ({ ...b, isCurrent: false }))
      ]),
      map(all => all.map(this.decorateBooking))
    ).subscribe(list => this.bookings = list);
  }

  /** เติม fields display_status, can_pay, can_view_ticket */
  private decorateBooking(b: any) {
    const now = new Date().getTime();
    const screeningTime = new Date(b.screening.screening_datetime).getTime();
    const movieDuration = b.screening.movie.duration * 60 * 1000; // นาที → ms
    const endTime = screeningTime + movieDuration;
    const expiresAt = b.expires_at ? new Date(b.expires_at).getTime() : 0;

    let display_status = '';
    let can_pay = false;
    let can_view_ticket = false;

    if (b.status === 'active') {
      if (!b.slip) {
        display_status = 'ยังไม่ได้ชำระเงิน';
        can_pay = true;
      } else if (b.slip.payment_status === 'pending') {
        display_status = 'รอยืนยันการชำระเงิน';
      } else if (b.slip.payment_status === 'rejected' && now < expiresAt) {
        display_status = 'ชำระเงินไม่สำเร็จ';
        can_pay = true;
      } else if (b.slip.payment_status === 'confirmed') {
        display_status = 'ชำระเงินแล้ว';
        if (now < endTime) {
          can_view_ticket = true;
        }
      }
    } else if (b.status === 'expired' || now > expiresAt) {
      display_status = 'หมดอายุ';
    } else if (b.status === 'cancelled') {
      display_status = 'ยกเลิกแล้ว';
    }

    return { ...b, display_status, can_pay, can_view_ticket };
  }

  cancel(b: any) {
    if (!confirm('ยืนยันยกเลิก?')) return;
    this.http.post(`http://localhost:8000/api/bookings/cancel/${b.id}`, {})
      .subscribe(() => this.ngOnInit());
  }

  goPay(id: number) {
    this.router.navigate(['/payment'], { queryParams: { booking_id: id } });
  }

  goTickets() {
    this.router.navigate(['/tickets']);
  }
}
