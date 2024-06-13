import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';

@Component({
  selector: 'app-payment-deposit-transfer',
  templateUrl: './payment-deposit-transfer.component.html',
  styleUrls: ['./payment-deposit-transfer.component.scss']
})
export class PaymentDepositTransferComponent implements OnInit {
  @Input() bankDetails: any;
  @Input() currentOrder: Order;
  @Input() currentExpertReview: any;

  selectedPaymentBank: string = 'Banco Pichincha';
  constructor(
    private location: Location,
  ) { }

  ngOnInit(): void {
    
    this.bankDetails = [
      {
        bank_logo: '../../../../../assets/images/bank1.png',
        bank_name: "Banco Pichincha",
        type_account: "Corriente",
        account_number: "9500605400",
        account_name: "RIKU SA"
      },
      {
        bank_logo: '../../../../../assets/images/bank2.svg',
        bank_name: "Banco internacional",
        type_account: "Corriente",
        account_number: "48557510048",
        account_name: "RIKU SA"
      }
    ];
  }
  selectPaymentBank(e: any) {
    this.selectedPaymentBank = e.target.value
  }
  back(){
    this.location.back();
  }
}
