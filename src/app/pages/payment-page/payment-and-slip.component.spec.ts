import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAndSlipComponent } from './payment-and-slip.component';

describe('PaymentAndSlipComponent', () => {
  let component: PaymentAndSlipComponent;
  let fixture: ComponentFixture<PaymentAndSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentAndSlipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAndSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
