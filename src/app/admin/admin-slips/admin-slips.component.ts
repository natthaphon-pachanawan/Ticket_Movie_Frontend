import { Component, OnInit } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';

interface Slip {
  id: number;
  booking_id: number;
  amount: number;
  payment_status: 'pending'|'confirmed'|'rejected';
  payment_date: string|null;
  slip_image_url: string;
  booking: {
    user: { username:string },
    screening:{ movie:{ title:string } , screening_datetime:string },
    total_price:number
  }
}

@Component({
  standalone:true,
  selector:'app-admin-slips',
  imports:[CommonModule,HttpClientModule],
  templateUrl:'./admin-slips.component.html',
  styleUrls:['./admin-slips.component.scss']
})
export class AdminSlipsComponent implements OnInit{
  slips:Slip[]=[];
  loading=true;

  constructor(private http:HttpClient){}

  ngOnInit(){ this.load(); }

  load(){
    this.loading=true;
    this.http.get<{data:Slip[]}>('http://localhost:8000/api/slips/list')
      .subscribe(res=>{this.slips=res.data;this.loading=false;});
  }

  imgSrc(s:Slip){
    return `http://localhost:8000/storage/${s.slip_image_url}`;
  }

  approve(s:Slip){ this.changeStatus(s,'confirmed'); }
  reject (s:Slip){ this.changeStatus(s,'rejected' ); }

  changeStatus(s:Slip,status:'confirmed'|'rejected'){
    if(!confirm(`เปลี่ยนสถานะเป็น ${status}?`)) return;
    const body={ payment_status:status, payment_date:new Date()
                       .toISOString().slice(0,19).replace('T',' ') };
    this.http.post(`http://localhost:8000/api/slips/update/${s.id}`,body)
        .subscribe(()=> this.load());
  }

  remove(s:Slip){
    if(!confirm('ลบสลิปนี้?'))return;
    this.http.delete(`http://localhost:8000/api/slips/delete/${s.id}`)
        .subscribe(()=> this.load());
  }
}
