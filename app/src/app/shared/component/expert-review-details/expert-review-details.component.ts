
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { ExpertReviewSteps, ExpertReviewStepsNumber } from '../../constant/add-order-constants';
import { Error } from '../../models/error.model';
import { ExpertReviewService } from '../expert-review/expert-review.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelExpertReviewDetailsDialogComponent } from './cancel-expert-review-details-dialog/cancel-expert-review-details-dialog.component';
import { SuccessfullComponent } from '../../modals/successfull/successfull.component';

@Component({
  selector: 'app-expert-review-details',
  templateUrl: './expert-review-details.component.html',
  styleUrls: ['./expert-review-details.component.scss']
})

export class ExpertReviewDetailsComponent implements OnInit {

  constructor(private toastr: ToastrService, private location: Location,private modalService: NgbModal, private activatedRoute: ActivatedRoute,
    private router: Router, private expertReviewService: ExpertReviewService, private userService: UserService) { }
  isAccepted: boolean = false;
  isProceed: boolean;
  errorMessage: string = 'Please select the option';

  currentExpertReviewStep: number = 1;
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: Order;
  loading: boolean = false;
  expertReviewId: string;
  expertReviewDetail: any = {};
  userType: string;

  ngOnInit(): void {
    this.userType = this.userService.getUserType();
    this.expertReviewId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    if (this.expertReviewId != '') {
      this.activatedRoute.queryParams
        .subscribe((params: any) => {
          if (params) {
            localStorage.setItem('current_expert_review_id', this.expertReviewId);
            this.showPaymentModal(params.payment_success == 'true' ? true : false);
          }
        }
       );
      this.getExpertReviewDetail();
    }

  }

  getExpertReviewDetail() {
    this.loading = true;
    this.expertReviewService.getSummaryDetails(this.expertReviewId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.setExpertReviewDetail(res.data);
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      }
    });
  }

  public showPaymentModal(isPaymentSuccess: boolean) {
    if (isPaymentSuccess == true) {
      const modalRef = this.modalService.open(SuccessfullComponent, {
        windowClass: 'success-role-modal'
      })
      modalRef.componentInstance.reviewPaymentSuccess = true;
    }
  }

  setExpertReviewDetail(currentReview: Order) {
    this.expertReviewDetail = currentReview;
    this.expertReviewDetail.expert_review_id = this.expertReviewDetail.id;
    if (this.expertReviewDetail.current_step) {
      const expertReviewStage: any = this.expertReviewDetail.current_step.toUpperCase();
      let currentStep: any = ExpertReviewStepsNumber[expertReviewStage];
      this.currentExpertReviewStep = currentStep;

    }

  }

  cancelExpertReview() {
    const modalRef = this.modalService.open(CancelExpertReviewDetailsDialogComponent, {
      windowClass: 'cancel-order-modal cancel-expert-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    })
    modalRef.componentInstance.expertReviewId = this.expertReviewId;
    modalRef.result.then((isCancel) => {
      if (isCancel) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-modal'
        })
        modalRef.componentInstance.cancelExpertReviewSuccess = true;
        this.getExpertReviewDetail()
      }
    }).catch((error: Error) => {
    });
  }

  viewReport(appraisalReportId: any) {
    this.router.navigate([`/${this.userType}/orders/appraisal-report/${appraisalReportId}`])
  }

  public get expertReviewStepNumber(): typeof ExpertReviewStepsNumber {
    return ExpertReviewStepsNumber;
  }

  public get expertReviewStep(): typeof ExpertReviewSteps {
    return ExpertReviewSteps;
  }

  back() {
    this.location.back();
  }

  continueProcess() {
    localStorage.setItem('current_expert_review_id', this.expertReviewId);
    // this.expe.setCurrentOrder(this.orderDetails)
    this.router.navigate([`/${this.userType}/add-expert-review`])
  }
}
