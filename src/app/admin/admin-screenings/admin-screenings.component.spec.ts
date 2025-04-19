import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScreeningsComponent } from './admin-screenings.component';

describe('AdminScreeningsComponent', () => {
  let component: AdminScreeningsComponent;
  let fixture: ComponentFixture<AdminScreeningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminScreeningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminScreeningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
