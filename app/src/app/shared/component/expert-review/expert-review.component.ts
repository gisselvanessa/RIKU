
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { ExpertReviewSteps, ExpertReviewStepsNumber, OrderStages, OrderStepsNumber, VehicleProcedureSteps, VehicleProcedureStepsNumber } from '../../constant/add-order-constants';
import { ExpertReviewService } from './expert-review.service';
import { Error } from '../../models/error.model';
import { ExpertReviewDetails } from './expert-review.model';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-expert-review',
  templateUrl: './expert-review.component.html',
  styleUrls: ['./expert-review.component.scss']
})

export class ExpertReviewComponent implements OnInit, OnDestroy {

  constructor(private toastr: ToastrService, private location: Location, private router: Router,
    private expertReviewService: ExpertReviewService) { }
  isAccepted: boolean = false;
  isProceed: boolean;
  errorMessage: string = 'Please select the option';

  currentExpertReviewStep: number = ExpertReviewStepsNumber.PRODUCT_SERVICES;
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: Order;
  @Input() currentStep: number;
  @Input() hideClass: boolean = true;
  loading: boolean = false;
  expertReviewId: string;
  expertReviewDetail: ExpertReviewDetails;
  currentOrderId:string;

  @ViewChild('expertStepsWrapper') expertStepsWrapper: ElementRef;

  ngOnInit(): void {
    const currentExpertReviewId = localStorage.getItem('current_expert_review_id');
    let currentExpertReview: any = this.expertReviewService.getCurrentExpertReview();
    if (currentExpertReviewId && currentExpertReview) {
      if (currentExpertReview.expert_review_id != currentExpertReviewId) {
        this.expertReviewId = currentExpertReview.expert_review_id;
        this.getExpertReviewDetail();
      } else {
        this.setExpertReviewDetail(currentExpertReview);
      }
    } else if (currentExpertReviewId && !currentExpertReview) {
      this.expertReviewId = currentExpertReviewId;
      this.getExpertReviewDetail();
    } else if (this.currentOrder) {
      if (this.currentOrder?.expert_evaluation.id) {
        this.expertReviewId = this.currentOrder?.expert_evaluation.id;
        this.getExpertReviewDetail();
      }
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

  setExpertReviewDetail(currentReview: any) {
    this.expertReviewDetail = currentReview;
    this.expertReviewDetail.expert_review_id = this.expertReviewDetail.id;
    if (this.expertReviewDetail.current_step) {
      const expertReviewStage: any = this.expertReviewDetail.current_step.toUpperCase();
      let currentStep: any = ExpertReviewStepsNumber[expertReviewStage];
      this.currentExpertReviewStep = currentStep;
    }
    else {
      this.currentExpertReviewStep = ExpertReviewStepsNumber.PRODUCT_SERVICES;
    }
  }

  public get expertReviewStepNumber(): typeof ExpertReviewStepsNumber {
    return ExpertReviewStepsNumber;
  }
  public get expertReviewStep(): typeof ExpertReviewSteps {
    return ExpertReviewSteps;
  }

  back() {
    if (this.currentOrder) {
      this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.PLACED });
    } else {
     // this.router.navigate(['/buyer/expert-reviews'])
      this.location.back();
    }
  }

  setNextStep(data: any) {
    this.currentExpertReviewStep = data.nextStep;
    this.expertReviewDetail = data.expertReviewDetail;
    this.expertReviewId = this.expertReviewDetail.expert_review_id;
    localStorage.setItem('current_expert_review_id', this.expertReviewDetail.expert_review_id);
    this.expertStepsWrapper.nativeElement.scrollIntoView();
  }

  setNextOrderStep(event: any) {
  if (this.currentOrder) {
      if(event.nextStep === OrderStepsNumber.SCHEDULE_MEETING){
        this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.SCHEDULE_MEETING });
      }else if(event.nextStep === OrderStepsNumber.VEHICLE_REVIEW){
        this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.VEHICLE_REVIEW });
      }else{
        this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: event.nextStep });
      }
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('current_expert_review_id');
  }
}
// 6e3d776f-8407-45da-aae0-faeee5d56779
