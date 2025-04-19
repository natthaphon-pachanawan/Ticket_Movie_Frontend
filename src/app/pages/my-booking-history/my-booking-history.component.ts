import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-my-booking-history',
  imports: [CommonModule, RouterModule],
  templateUrl: './my-booking-history.component.html',
  styleUrls: ['./my-booking-history.component.scss']
})
export class MyBookingHistoryComponent implements OnInit {
  history:any[]=[];
  constructor(private http:HttpClient){}
  ngOnInit(){
    this.http.get<any>('http://localhost:8000/api/bookings/history')
      .subscribe(r=>this.history = r.data??r);
  }
}
