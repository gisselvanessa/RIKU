import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ExpertReviewService } from '../expert-review.service';
import { BuyerOrdersService } from '../../../../modules/buyers/buyer-orders/buyer-orders.service';

import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { OrderStepsNumber, OrderStages } from 'src/app/shared/constant/add-order-constants';

import { Error } from 'src/app/shared/models/error.model';
import { ExpertListResponse, Package, SelectPackageResponse } from '../expert-review.model';
import { ExpertReviewStepsNumber } from '../../../constant/add-order-constants';


@Component({
  selector: 'app-product-services',
  templateUrl: './product-services.component.html',
  styleUrls: ['./product-services.component.scss']
})

export class ProductServicesComponent implements OnInit {

  constructor(private expertEvaluationService: ExpertReviewService,
    private toastr: ToastrService, private buyerOrdersService: BuyerOrdersService) { }
  isAccepted: boolean;
  isProceed: boolean = false;
  errorMessage: string = '';
  packageList: Package[] = [];
  packageOnly: any = {};

  @Input() currentStep: number;
  @Input() currentOrder: Order;
  @Input() currentExpertReview: any;
  @Input() currentExpertReviewStep: number;

  @Output() onSubmitOrderDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Output() onSubmitExpertReviewDetails: EventEmitter<{ orderDetail?: Order, nextStep: number, expertReviewDetail: any }> = new EventEmitter();

  loading: boolean = false;

  ngOnInit(): void {
    this.getExpertPackages();
    this.isProceed = false;
    if (localStorage.getItem('isProceed') == 'true') {
      this.isProceed = true
    }
  }


  getExpertPackages() {
    this.loading = true;
    this.expertEvaluationService.getPackages().subscribe({
      next: (res: ExpertListResponse) => {
        this.loading = false;
        // this.setNextStep();
        this.packageList = res.data;
        this.packageOnly= this.packageList[0] // added for obtain the first package
        
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
    });
  }

  selectExpertPackage(expertPackageId: string) {
    console.log('this.isProceed', this.isProceed);
    if (expertPackageId == 'no') {
      if (this.isProceed == false) {
        this.errorMessage = 'Please select the option';
      } else {
        const data: any = {};
        if (this.currentOrder) {
          if (!this.currentOrder.expert_evaluation.id) {
            this.goToNextStep('');
            return;
          }
          data['expert_review_id'] = this.currentOrder.expert_evaluation.id;
          this.goToNextStep('');
        }
      }
    } else {
      if(localStorage.getItem('isProceed')){
        localStorage.removeItem('isProceed')
      }
      const data: any = {};
      if (this.currentOrder) {
        if (!this.currentOrder.expert_evaluation.id) {
          this.goToNextStep(expertPackageId);
          return;
        }
        data['expert_review_id'] = this.currentOrder.expert_evaluation.id;
      }
      if (expertPackageId && expertPackageId.trim() != '') {
        data['expert_package_id'] = expertPackageId;
        this.expertEvaluationService.selectExpertReviewPackage(data).subscribe({
          next: (res: SelectPackageResponse) => {
            this.loading = false;
            if (!this.currentExpertReview) {
              this.currentExpertReview = {};
              this.currentExpertReview['expert_review_id'] = res.data.id;
              const packageDetail: any = this.packageList.find(x => x.id == expertPackageId);
              this.currentExpertReview['package_details'] = {};
              this.currentExpertReview['package_details']['package_name'] = packageDetail.name;
              this.currentExpertReview['package_details']['is_recommended'] = packageDetail.is_recommended;
              this.currentExpertReview['package_details']['id'] = packageDetail.id;
              this.currentExpertReview['package_details']['package_price'] = packageDetail.price;
              this.currentExpertReview['package_details']['package_services'] = packageDetail.details;
            }
            this.setNextStep(expertPackageId);
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
        });
      }
    }

  }

  goToNextStep(packageId: string): void {
    this.loading = true;
    const currentStage: any = this.currentOrder.current_stage.toUpperCase();
    const completedStep: any = OrderStepsNumber[currentStage];
    if (completedStep > OrderStepsNumber.BUY_NOW) {
      this.setNextStep('');
    } else {
      const isExpertEvaluation = packageId != '' ? true : false;
      let data: any = {
        order_id: this.currentOrder.order_id,
        is_expert_evaluation: isExpertEvaluation,
        current_stage: OrderStages.EXPERT_EVALUATION
      }
      if (packageId != '') {
        data['expert_package_id'] = packageId;
      }
      this.buyerOrdersService.expertReviewCheck(data).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (!this.currentExpertReview && res.data.expert_review_id) {
            this.currentExpertReview = {};
            this.currentExpertReview['expert_review_id'] = res.data.expert_review_id;
            this.currentExpertReview['package_details'] = {};
            const packageDetail: any = this.packageList.find(x => x.id == packageId);
            this.currentExpertReview['package_details']['package_name'] = packageDetail.name;
            this.currentExpertReview['package_details']['is_recommended'] = packageDetail.is_recommended;
            this.currentExpertReview['package_details']['id'] = packageDetail.id;
            this.currentExpertReview['package_details']['package_price'] = packageDetail.price;
            this.currentExpertReview['package_details']['package_services'] = packageDetail.details;
          }
          this.setNextStep(packageId);
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
      });
    }
  }

  setNextStep(packageId: string) {
    if (!packageId || packageId.trim() == '') {
      this.currentOrder.expert_evaluation.is_expert_evaluation = false;
      this.currentOrder.expert_evaluation.id = null;
      this.onSubmitOrderDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.SCHEDULE_MEETING });
      localStorage.setItem('isProceed', 'true')
    } else {
      this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.FIND_EXPERT_APPRAISER, expertReviewDetail: this.currentExpertReview })
    }
  }

  dontProceed() {
    if(this.errorMessage != ''){
      this.errorMessage = '';
    }
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }

  back() {
    this.onSubmitOrderDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.PLACED });
  }

}
