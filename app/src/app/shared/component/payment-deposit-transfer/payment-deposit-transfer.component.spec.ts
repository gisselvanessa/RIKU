import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDepositTransferComponent } from './payment-deposit-transfer.component';

describe('PaymentDepositTransferComponent', () => {
  let component: PaymentDepositTransferComponent;
  let fixture: ComponentFixture<PaymentDepositTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentDepositTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentDepositTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
