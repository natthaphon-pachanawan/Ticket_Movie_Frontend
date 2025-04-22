import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { HttpClient }    from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule }  from '@angular/router';

interface DailySummary {
  date: string;
  tickets_sold: number;
  revenue: number;
}

interface SalesReport {
  from: string;
  to: string;
  total_revenue: number;
  total_bookings: number;
  daily: DailySummary[];
}

@Component({
  standalone: true,
  selector: 'app-admin-reports',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {
  report: SalesReport | null = null;
  loading = false;
  fromDate = ''; 
  toDate   = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const today = new Date().toISOString().slice(0,10);
    this.toDate   = today;
    this.fromDate = new Date(Date.now() - 30*86400_000).toISOString().slice(0,10);
    this.load();
  }

  load() {
    this.loading = true;
    const params = {
      from: this.fromDate,
      to:   this.toDate
    };
    this.http.get<{data:SalesReport}>(
      `http://localhost:8000/api/reports/sales`,
      { params }
    ).subscribe({
      next: res => {
        this.report = res.data;
        this.loading = false;
      },
      error: err => {
        alert('❌ Cannot load report');
        console.error(err);
        this.loading = false;
      }
    });
  }
}
