import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-payment-information',
  templateUrl: './card-payment-information.component.html',
  styleUrls: ['./card-payment-information.component.scss']
})
export class CardPaymentInformationComponent implements OnInit {
  @Input() number: string = '';
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() type: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}