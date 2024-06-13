import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEmailAndMobileComponent } from './change-email-and-mobile.component';

describe('ChangeEmailAndMobileComponent', () => {
  let component: ChangeEmailAndMobileComponent;
  let fixture: ComponentFixture<ChangeEmailAndMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeEmailAndMobileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeEmailAndMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
