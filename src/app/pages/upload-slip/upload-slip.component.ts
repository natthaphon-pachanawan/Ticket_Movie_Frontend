import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-upload-slip',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './upload-slip.component.html',
  styleUrls: ['./upload-slip.component.scss']
})
export class UploadSlipComponent implements OnInit {
  bookingId!: number;
  booking: any;
  estimatedAmount = 0;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  /* ---------------------------------------------------- */
  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('booking_id');
    if (!id) {
      alert('ไม่พบรหัสการจอง'); this.router.navigate(['/my-bookings']); return;
    }

    this.bookingId = +id;
    this.fetchBooking();
  }

  /* ---------------------------------------------------- */
  get slip() { return this.booking?.slip; }          // ทางลัด
  get slipStatus(): 'none'|'pending'|'confirmed'|'rejected' {
    if (!this.slip) return 'none';
    return this.slip.payment_status as any;
  }
  canUpload(): boolean {
    return this.slipStatus === 'none' || this.slipStatus === 'rejected';
  }

  /* ---------------------------------------------------- */
  fetchBooking() {
    this.http.get<any>(`http://localhost:8000/api/bookings/detail/${this.bookingId}`)
      .subscribe({
        next: res => {
          this.booking = res.data ?? res;
          this.estimatedAmount = this.booking.total_price;
        },
        error: () => {
          alert('❌ โหลดข้อมูลการจองไม่สำเร็จ');
          this.router.navigate(['/my-bookings']);
        }
      });
  }

  /* ---------------------------------------------------- */
  onFileSelected(ev: any) {
    if (!this.canUpload()) return;          // ป้องกันกรณีไม่อนุญาต
    this.selectedFile = ev.target.files[0] ?? null;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => (this.previewUrl = (e as any).target.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  /* ---------------------------------------------------- */
  uploadSlip() {
    if (!this.selectedFile || !this.canUpload()) return;

    const form = new FormData();
    form.append('booking_id',   this.bookingId.toString());
    form.append('slip_image_url', this.selectedFile);
    form.append('amount',       this.estimatedAmount.toString());
    form.append('payment_status','pending');
    form.append('payment_date',  new Date().toISOString().slice(0,19).replace('T',' '));

    this.uploading = true;
    this.http.post('http://localhost:8000/api/slips/create', form)
      .subscribe({
        next: () => {
          alert('🎉 อัปโหลดสลิปสำเร็จ!');
          this.uploading = false;
          this.previewUrl = null;
          this.selectedFile = null;
          this.fetchBooking();            // reload slip status
        },
        error: err => {
          console.error(err);
          alert('❌ อัปโหลดล้มเหลว');
          this.uploading = false;
        }
      });
  }
}
