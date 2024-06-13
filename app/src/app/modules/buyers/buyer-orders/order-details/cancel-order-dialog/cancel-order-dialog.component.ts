import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { BuyerOrdersService } from '../../buyer-orders.service';

import { Error } from 'src/app/shared/models/error.model';





@Component({
  selector: 'app-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss']
})
export class CancelOrderDialogComponent implements OnInit {

  @Input() orderId: string;
  loading: boolean = false;
  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService,
    private translate: TranslateService, private modalService: NgbModal,
    private buyerOrdersService: BuyerOrdersService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true;
    this.buyerOrdersService.cancelOrder({ order_id: this.orderId }).subscribe({
      next: () => {
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
        this.activeModal.close(false);
      }
    });
  }

  ngOnDestroy() {
  }
}
