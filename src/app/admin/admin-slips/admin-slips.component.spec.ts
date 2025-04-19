import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSlipsComponent } from './admin-slips.component';

describe('AdminSlipsComponent', () => {
  let component: AdminSlipsComponent;
  let fixture: ComponentFixture<AdminSlipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSlipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
