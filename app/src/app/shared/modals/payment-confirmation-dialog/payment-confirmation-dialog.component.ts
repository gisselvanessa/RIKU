import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from 'src/app/modules/admin/orders/orders.service';
import { Error } from '../../models/error.model';

@Component({
  selector: 'app-payment-confirmation-dialog',
  templateUrl: './payment-confirmation-dialog.component.html',
  styleUrls: ['./payment-confirmation-dialog.component.scss']
})

export class PaymentConfirmationDialogComponent implements OnInit {

  @Input()orderId: string;
  @Input()isReceived: boolean = false;
  loading: boolean = false;
  errorMessage: string;

  constructor(private toastr: ToastrService, private ordersService: OrdersService,
    public activeModal: NgbActiveModal, private translate:TranslateService) { }

  ngOnInit(): void {
  }


  onSubmit(): void {
    const data = {
      order_id: this.orderId,
      is_received: this.isReceived
    }
    this.loading = true;
    this.ordersService.confirmPayment(data).subscribe({
      next: () => {
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (errorRes:Error) => {
        this.loading = true;
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.errorMessage = error.error[0];
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }
}
