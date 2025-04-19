import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScreeningFormComponent } from './admin-screening-form.component';

describe('AdminScreeningFormComponent', () => {
  let component: AdminScreeningFormComponent;
  let fixture: ComponentFixture<AdminScreeningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminScreeningFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminScreeningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
