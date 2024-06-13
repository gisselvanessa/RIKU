import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPaymentInformationComponent } from './card-payment-information.component';

describe('CardPaymentInformationComponent', () => {
  let component: CardPaymentInformationComponent;
  let fixture: ComponentFixture<CardPaymentInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPaymentInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPaymentInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
