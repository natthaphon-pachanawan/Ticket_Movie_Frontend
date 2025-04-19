import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomFormComponent } from './admin-room-form.component';

describe('AdminRoomFormComponent', () => {
  let component: AdminRoomFormComponent;
  let fixture: ComponentFixture<AdminRoomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRoomFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
