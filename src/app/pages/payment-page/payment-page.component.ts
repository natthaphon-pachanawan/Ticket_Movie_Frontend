import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-payment-page',
  imports:[CommonModule],
  templateUrl:'./payment-page.component.html',
  styleUrls:['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit{
  booking:any;
  loading=true;
  constructor(
    private route:ActivatedRoute,
    private http:HttpClient,
    private router:Router
  ){}
  ngOnInit(){
    const id=this.route.snapshot.queryParamMap.get('booking_id');
    if(!id){ this.router.navigate(['/']);return;}
    this.http.get<any>(`http://localhost:8000/api/bookings/detail/${id}`)
      .subscribe(res=>{this.booking=res.data??res;this.loading=false;});
  }
  goUpload(){
    this.router.navigate(['/upload-slip'],{queryParams:{booking_id:this.booking.id}});
  }
  cancel(){
    if(!confirm('ยืนยันยกเลิกการจอง?'))return;
    this.http.post(`http://localhost:8000/api/bookings/cancel/${this.booking.id}`,{})
      .subscribe(()=>this.router.navigate(['/my-bookings']));
  }
}
