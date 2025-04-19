import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeatsComponent } from './admin-seats.component';

describe('AdminSeatsComponent', () => {
  let component: AdminSeatsComponent;
  let fixture: ComponentFixture<AdminSeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
