import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { Error } from 'src/app/shared/models/error.model';
import { SummaryDetails } from '../expert-review.model';
import { ExpertReviewService } from '../expert-review.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { OrderStepsNumber } from 'src/app/shared/constant/add-order-constants';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})

export class SummaryComponent implements OnInit {

  @Input() currentExpertReviewStep: number;
  @Output() onSubmitExpertReviewDetails: EventEmitter<{ nextStep: number }> = new EventEmitter();
  @Output() onSubmitOrderDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: any;
  @Input() expertReviewId: string;
  @Input() currentExpertReview: any;
  @Input() hideClass: boolean = true;
  summaryDetails: SummaryDetails;
  loading: boolean = false;

  constructor(private expertReviewService: ExpertReviewService, private toastr: ToastrService,
    private router: Router, private location: Location, private userService: UserService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.loading = true;
    this.expertReviewService.getSummaryDetails(this.expertReviewId).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.summaryDetails = resp.data;
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      }

    })
  }
  goBackTo() {
    const userType = this.userService.getUserType();
    if (this.currentOrder || this.currentExpertReview.order_id) {
      if (this.userService.isFromMobile) {
        this.router.navigate([`/${userType}/orders/order-details/${this.currentExpertReview.order_id}`])
      } else {
        if (this.currentExpertReview.appraisal_report_status === 'in_pending') {
          // this.toastr.warning(this.translate.instant("You can't proceed further until appraisal report generated"))
          this.router.navigate([`/${userType}/orders/order-details/${this.currentExpertReview.order_id}`])
        } else {
          // if (this.currentOrder) {
          //   let currentStep: any = OrderStepsNumber[this.currentOrder.current_stage.toUpperCase()];
          //   this.onSubmitOrderDetails.emit({ orderDetail: this.currentOrder, nextStep: currentStep });
          // } else {
          //   this.router.navigate([`/${userType}/orders/order-details/${this.currentExpertReview.order_id}`])
          // }
          this.router.navigate([`/${userType}/orders/order-details/${this.currentExpertReview.order_id}`])
        }
      }
    } else {
      this.router.navigate([`/${userType}/expert-reviews`])
    }
  }
  goToNextStep(){
    this.onSubmitOrderDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.SCHEDULE_MEETING });
    localStorage.setItem('isProceed', 'true')
  }
}
