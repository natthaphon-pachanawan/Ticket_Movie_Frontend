import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Seat {
  id: number;
  seat_number: string;
  row: number | string;
  column: number | string;
  seat_type: 'VIP' | 'Regular';
  is_active: boolean;
  is_reserved: 0 | 1;        // <‑‑ เพิ่ม
  screening_room_id: number;
}

@Component({
  standalone: true,
  selector: 'app-booking-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.scss']
})
export class BookingCreateComponent implements OnInit {
  screeningId!: number;
  screening: any;
  seats: Seat[] = [];
  seatsByRow: { [row: string]: Seat[] } = {};
  selectedSeats: Seat[] = [];
  basePrice!: number;
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      this.router.navigate(['/login']);
      return;
    }
    this.screeningId = +this.route.snapshot.queryParamMap.get('screening_id')!;
    this.loadScreeningDetail();
  }

  loadScreeningDetail(): void {
    // เรียกดูรายละเอียดรอบฉาย
    this.http
      .get<any>(`http://localhost:8000/api/screenings/detail/${this.screeningId}`)
      .subscribe((res) => {
        this.screening = res.data ?? res;
        this.basePrice = this.screening.price;
        const roomId = this.screening.screening_room_id;
        // เรียกดูข้อมูลที่นั่งของห้อง
        this.http
        this.http.get<any>(`http://localhost:8000/api/seats/list/${roomId}?screening_id=${this.screeningId}`)
          .subscribe((seatRes) => {
            const seatData = seatRes.data ?? seatRes;
            this.seats = seatData;
            this.seatsByRow = this.groupSeatsByRow(this.seats);
          });
      });
  }

  // จัดกลุ่มที่นั่งตามแถว โดยสร้าง key แบบ "Row-<row_number>"
  groupSeatsByRow(seats: Seat[]): { [row: string]: Seat[] } {
    return seats.reduce((group, seat) => {
      const rowKey = 'แถวที่ ' + seat.row;
      if (!group[rowKey]) {
        group[rowKey] = [];
      }
      group[rowKey].push(seat);
      return group;
    }, {} as { [row: string]: Seat[] });
  }

  // getter เพื่อให้ template เรียกใช้ได้โดยจะเรียงแถวแบบ descending:
  // แถวที่มีเลขสูงสุดจะแสดงด้านบน และแถวที่มีเลขต่ำสุด (เช่น Row-1) อยู่ล่างสุด
  getRowKeys(): string[] {
    return Object.keys(this.seatsByRow).sort((a, b) => {
      const rowA = parseInt(a.replace('แถวที่ ', ''));
      const rowB = parseInt(b.replace('แถวที่ ', ''));
      return rowB - rowA;
    });
  }

  toggleSelect(seat: Seat): void {
    if (!seat.is_active || seat.is_reserved) { return; }  // <‑‑ บล็อก
    const i = this.selectedSeats.findIndex(s => s.id === seat.id);
    i > -1 ? this.selectedSeats.splice(i, 1) : this.selectedSeats.push(seat);
  }

  isSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.id === seat.id);
  }

  // ฟังก์ชันคำนวณราคาที่นั่งแต่ละตัว: ถ้า VIP เพิ่ม 100 บาท
  seatPrice(seat: Seat): number {
    const base = Number(this.basePrice);
    const price = seat.seat_type === 'VIP' ? base + 100 : base;
    return parseFloat(price.toFixed(2)); // ✅ ปัดให้เป็นทศนิยม 2 ตำแหน่ง
  }

  // คำนวณราคารวมของที่นั่งที่เลือก
  get totalPrice(): number {
    const total = this.selectedSeats.reduce((sum, seat) => sum + this.seatPrice(seat), 0);
    return parseFloat(total.toFixed(2)); // ✅ ปัดราคารวม
  }

  // ส่งข้อมูลการจอง (Booking) ไปยัง Back-end พร้อม array ของ seat IDs
  // booking-create.component.ts (เฉพาะส่วน submitBooking)
  submitBooking(): void {
    if (!this.token) return;
    if (this.selectedSeats.length === 0) {
      alert('กรุณาเลือกที่นั่งอย่างน้อย 1 ตัว');
      return;
    }

    const seatIds = this.selectedSeats.map(s => s.id);
    const body = {
      screening_id: this.screeningId,
      total_price: this.totalPrice,
      seats: seatIds
    };

    this.http.post(
      'http://localhost:8000/api/bookings/create',
      body,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).subscribe({
      next: (res: any) => {
        alert('🎉 จองสำเร็จ!');
        this.router.navigate(['/payment'], { queryParams: { booking_id: res.data.id } });
      },
      error: err => {
        alert('❌ เกิดข้อผิดพลาดในการจองตั๋ว');
        console.error(err);
      }
    });
  }

}
