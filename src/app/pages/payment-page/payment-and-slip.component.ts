import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-payment-and-slip',
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './payment-and-slip.component.html',
  styleUrls: ['./payment-and-slip.component.scss']
})
export class PaymentAndSlipComponent implements OnInit {
  booking: any;
  loading = true;

  // สลิป
  slip: any = null;
  slipStatus: 'none'|'pending'|'confirmed'|'rejected' = 'none';

  // อัพโหลดใหม่
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.queryParamMap.get('booking_id');
    if (!id) {
      this.router.navigate(['/my-bookings']);
      return;
    }
    this.fetchBooking(+id);
  }

  private fetchBooking(id: number) {
    this.loading = true;
    this.http.get<any>(`http://localhost:8000/api/bookings/detail/${id}`)
      .subscribe({
        next: res => {
          this.booking = res.data ?? res;
          this.slip = this.booking.slip ?? null;
          this.slipStatus = this.slip?.payment_status ?? 'none';
          this.loading = false;
        },
        error: () => {
          alert('❌ โหลดข้อมูลไม่สำเร็จ');
          this.router.navigate(['/my-bookings']);
        }
      });
  }

  // เงื่อนไขว่าปุ่มอัปโหลดใหม่ควรโชว์ไหม
  canUpload(): boolean {
    return this.slipStatus === 'none' || this.slipStatus === 'rejected';
  }

  onFileSelected(ev: any) {
    if (!this.canUpload()) return;
    this.selectedFile = ev.target.files[0] ?? null;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = (e as any).target.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadSlip() {
    if (!this.canUpload() || !this.selectedFile) return;
    const form = new FormData();
    form.append('booking_id',   this.booking.id.toString());
    form.append('slip_image_url', this.selectedFile);
    form.append('amount',       this.booking.total_price.toString());
    form.append('payment_status','pending');
    form.append('payment_date',  new Date().toISOString().slice(0,19).replace('T',' '));

    this.uploading = true;
    const request$ = this.slip
      // ถ้ามีสลิปเดิม ให้ไปอัพเดต
      ? this.http.post(
          `http://localhost:8000/api/slips/update/${this.slip.id}`,
          form
        )
      // ไม่มีเดิม ให้สร้างใหม่
      : this.http.post(
          'http://localhost:8000/api/slips/create',
          form
        );

    request$.subscribe({
      next: () => {
        alert('🎉 สลิปถูกส่งแล้ว รอแอดมินตรวจสอบ');
        this.selectedFile = null;
        this.previewUrl = null;
        this.uploading = false;
        this.fetchBooking(this.booking.id);
      },
      error: err => {
        console.error(err);
        alert('❌ อัปโหลดสลิปล้มเหลว');
        this.uploading = false;
      }
    });
  }

  cancelBooking() {
    if (!confirm('ยืนยันยกเลิกการจอง?')) return;
    this.http.post(`http://localhost:8000/api/bookings/cancel/${this.booking.id}`, {})
      .subscribe(() => this.router.navigate(['/my-bookings']));
  }
}
