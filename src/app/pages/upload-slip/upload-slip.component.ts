import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-upload-slip',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './upload-slip.component.html',
  styleUrls: ['./upload-slip.component.scss']
})
export class UploadSlipComponent implements OnInit {
  bookingId!: number;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  booking: any;
  estimatedAmount: number = 0;


  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    const bookingParam = this.route.snapshot.queryParamMap.get('booking_id');
    if (!bookingParam) {
      alert('ไม่พบรหัสการจอง');
      this.router.navigate(['/my-bookings']);
      return;
    }
  
    this.bookingId = +bookingParam;
  
    this.http.get<any>(`http://localhost:8000/api/bookings/detail/${this.bookingId}`).subscribe({
      next: res => {
        this.booking = res.data ?? res;
        this.estimatedAmount = this.booking.total_price;
      },
      error: err => {
        alert('❌ ไม่สามารถโหลดข้อมูลการจองได้');
        console.error(err);
        this.router.navigate(['/my-bookings']);
      }
    });
  }
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadSlip() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('booking_id', this.bookingId.toString());
    formData.append('slip_image_url', this.selectedFile);
    formData.append('amount', this.estimatedAmount.toString()); // คำนวณจาก booking.total_price
    formData.append('payment_status', 'pending'); // ค่า default
    formData.append('payment_date', new Date().toISOString().slice(0, 19).replace('T', ' '));


    this.http.post('http://localhost:8000/api/slips/create', formData).subscribe({
      next: () => {
        alert('🎉 อัปโหลดสลิปสำเร็จ!');
        this.router.navigate(['/my-bookings']);
      },
      error: err => {
        alert('❌ อัปโหลดล้มเหลว');
        console.error(err);
      }
    });
  }
}
