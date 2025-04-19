import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeatFormComponent } from './admin-seat-form.component';

describe('AdminSeatFormComponent', () => {
  let component: AdminSeatFormComponent;
  let fixture: ComponentFixture<AdminSeatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeatFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
