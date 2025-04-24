import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface PreviewSeat {
  row: number;
  column: number;
  seat_number: string;
  include: boolean;
  seat_type: 'regular' | 'VIP';
}

@Component({
  standalone: true,
  selector: 'app-admin-seat-form',
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './admin-seat-form.component.html',
  styleUrls: ['./admin-seat-form.component.scss']
})
export class AdminSeatFormComponent implements OnInit {
  isEdit = false;
  seatId!: number;
  roomId!: number;
  roomCapacity = 0;               // ความจุห้อง

  // โหมด single / bulk
  mode: 'single' | 'bulk' = 'single';

  // ข้อมูลสำหรับ single
  seat: any = {
    screening_room_id: null,
    seat_number: '',
    row: null,
    column: null,
    seat_type: 'regular',
    is_active: true
  };

  // ข้อมูลสำหรับ bulk
  bulk = {
    start_row: 1,
    bulk_rows: 1,
    bulk_columns: 1,
    prefix: ''
  };

  // สำหรับพรีวิวใน bulk mode
  previewSeats: PreviewSeat[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    // 1) ดึง room_id
    this.roomId = +this.route.snapshot.queryParamMap.get('room_id')!;
    this.seat.screening_room_id = this.roomId;

    // 2) โหลดรายละเอียดห้อง (รวม seat_capacity และ รายการ seats สำหรับ edit)
    this.http
      .get<{ data: any }>(`http://localhost:8000/api/screening-rooms/detail/${this.roomId}`)
      .subscribe(res => {
        const room = res.data;
        this.roomCapacity = room.seat_capacity;

        // ถ้ามี param id → edit mode
        const paramId = this.route.snapshot.paramMap.get('id');
        if (paramId) {
          this.isEdit = true;
          this.mode = 'single';            // บังคับโหมด single
          this.seatId = +paramId;
          // โหลดข้อมูลที่นั่งตัวเดิมมาแปะ
          const found = room.seats.find((s: any) => s.id === this.seatId);
          if (found) {
            this.seat = { ...found };
          }
        } else {
          // ถ้า add mode → คำนวณ default bulk
          this.setBulkDefaults();
        }

        // สร้างพรีวิวครั้งแรก
        this.generatePreview();
      });
  }

  /** คำนวณ default rows/columns ตาม capacity */
  private setBulkDefaults() {
    const cap = this.roomCapacity;
    // ให้ grid เป็นสี่เหลี่ยมใกล้เคียง: 
    // หา columns = ceil(sqrt(cap)), rows = ceil(cap/columns)
    const cols = Math.ceil(Math.sqrt(cap));
    const rows = Math.ceil(cap / cols);
    this.bulk.bulk_columns = cols;
    this.bulk.bulk_rows = rows;
    this.bulk.start_row = 1;
    this.bulk.prefix = '';
  }

  /** สร้าง previewSeats ทุกครั้งที่ปรับ bulk */
  generatePreview() {
    this.previewSeats = [];
    if (this.mode !== 'bulk') return;

    const { start_row, bulk_rows, bulk_columns, prefix } = this.bulk;
    let count = 0;
    const cap = this.roomCapacity;

    for (let i = 0; i < bulk_rows; i++) {
      const r = start_row + i;
      const label = prefix || String.fromCharCode(64 + r); // A=1,B=2…

      for (let c = 1; c <= bulk_columns; c++) {
        if (count >= cap) return;  // ตัดส่วนเกิน
        this.previewSeats.push({
          row: r,
          column: c,
          seat_number: `${label}${c}`,
          include: true,
          seat_type: 'regular'
        });
        count++;
      }
    }
  }

  /** toggle เลือก/ไม่เลือกในพรีวิว */
  toggleInclude(s: PreviewSeat) {
    s.include = !s.include;
  }

  /** บันทึกทั้ง single และ bulk */
  save() {
    let payload: any;

    if (this.mode === 'single') {
      payload = {
        mode: 'single',
        screening_room_id: this.roomId,
        seat_number: this.seat.seat_number,
        row: this.seat.row,
        column: this.seat.column,
        seat_type: this.seat.seat_type,
        is_active: this.seat.is_active
      };
    } else {
      const seats = this.previewSeats
        .filter(s => s.include)
        .map(s => ({
          seat_number: s.seat_number,
          row: s.row,
          column: s.column,
          seat_type: s.seat_type
        }));
      payload = {
        mode: 'bulk',
        screening_room_id: this.roomId,
        seats,
        is_active: this.seat.is_active
      };
    }

    const url = this.isEdit
      ? `http://localhost:8000/api/seats/update/${this.seatId}`
      : `http://localhost:8000/api/seats/create`;

    this.http.post(url, payload).subscribe(() => {
      this.router.navigate(['/admin/seats'], {
        queryParams: { room_id: this.roomId }
      });
    });
  }
}
