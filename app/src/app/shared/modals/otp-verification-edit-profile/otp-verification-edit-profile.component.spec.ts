import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerificationEditProfileComponent } from './otp-verification-edit-profile.component';

describe('OtpVerificationEditProfileComponent', () => {
  let component: OtpVerificationEditProfileComponent;
  let fixture: ComponentFixture<OtpVerificationEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpVerificationEditProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpVerificationEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
