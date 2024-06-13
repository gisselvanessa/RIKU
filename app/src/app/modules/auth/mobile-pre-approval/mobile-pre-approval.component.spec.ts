import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePreApprovalComponent } from './mobile-pre-approval.component';

describe('MobilePreApprovalComponent', () => {
  let component: MobilePreApprovalComponent;
  let fixture: ComponentFixture<MobilePreApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilePreApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilePreApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
