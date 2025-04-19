import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCinemaFormComponent } from './admin-cinema-form.component';

describe('AdminCinemaFormComponent', () => {
  let component: AdminCinemaFormComponent;
  let fixture: ComponentFixture<AdminCinemaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCinemaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCinemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
