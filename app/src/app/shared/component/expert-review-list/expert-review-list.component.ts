import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { PaginationData } from 'src/app/modules/admin/manage-experts/manage-experts.model';
import { ExpertReviewStepsNumber } from '../../constant/add-order-constants';
import { SuccessfullComponent } from '../../modals/successfull/successfull.component';
import { Error } from '../../models/error.model';
import { UserService } from '../../services/user.service';
import { CancelExpertReviewDetailsDialogComponent } from '../expert-review-details/cancel-expert-review-details-dialog/cancel-expert-review-details-dialog.component';
import { ExpertReviewService } from '../expert-review/expert-review.service';

@Component({
  selector: 'app-expert-review-list',
  templateUrl: './expert-review-list.component.html',
  styleUrls: ['./expert-review-list.component.scss']
})

export class ExpertReviewListComponent implements OnInit {
  paginationData: PaginationData = new PaginationData();
  loading: boolean = false;
  selectedTab: string = 'other';
  expertReviewList: Array<any> = [];
  limit: number;
  page: number = 1;
  sortingOrder: boolean;
  sortBy: string = 'id';
  order: string = 'DESC';
  searchKeyword: string = '';
  userType: string;
  allFilterParams: any = {};
  currentExpertReviewStep: any[] = [];

  constructor(private router: Router, private translate: TranslateService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private toastr: ToastrService,
    private userService: UserService, private expertReviewService: ExpertReviewService) { }


  ngOnInit(): void {
    if (window.innerWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 20;
    }
    this.userType = this.userService.getUserType();
    localStorage.removeItem('expert_review_id');
    this.getAllExpertReviewList({ page: this.page, limit: this.limit, sort_by: this.sortBy, sort_order: this.order })
  }


  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sortBy != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.allFilterParams.sort_by = this.sortBy
    this.allFilterParams.sort_order = this.order
    this.getAllExpertReviewList(this.allFilterParams)
  }


  setSearchText(keyword: string) {
    if (keyword != '') {
      setTimeout(() => {
        this.allFilterParams.search = keyword;
        this.getAllExpertReviewList(this.allFilterParams)
      }, 1000);
    } else {
      if (this.allFilterParams.search) {
        delete this.allFilterParams.search;
        this.getAllExpertReviewList(this.allFilterParams)
      }
    }
  }


  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    this.allFilterParams.page = this.page;
    this.allFilterParams.limit = this.limit;
    this.allFilterParams.status = this.selectedTab;
    this.getAllExpertReviewList(this.allFilterParams)
  }

  cancelExpertReview(expertReviewId: any) {
    const modalRef = this.modalService.open(CancelExpertReviewDetailsDialogComponent, {
      windowClass: 'cancel-order-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.componentInstance.expertReviewId = expertReviewId;
    modalRef.result.then((isCancel) => {
      if (isCancel) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-modal'
        })
        modalRef.componentInstance.cancelExpertReviewSuccess = true;
        this.getAllExpertReviewList(this.allFilterParams)
      }
    }).catch((error: Error) => {
    });
  }


  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = page;
    this.getAllExpertReviewList(this.allFilterParams);
  }
  openExpertReviewDetails(id: any, i?: any) {
    if (this.userType === 'buyer') {
      if (this.expertReviewList[i].order_id != null) {
        this.router.navigate([`/user/buyer-orders/order-details/${this.expertReviewList[i].order_id}`])
      } else {
        this.router.navigate([`/${this.userType}/expert-review-details/${id}`])
      }
    } else {
      this.router.navigate([`/${this.userType}/expert-review-details/${id}`])
    }

  }

  getAllExpertReviewList(params: any): void {
    this.allFilterParams = params;
    this.loading = true;
    this.expertReviewService.getExpertReviewList(params).subscribe({
      next: (resp) => {
        this.expertReviewList = resp.data.items ? resp.data.items : [];
        this.paginationData = resp.data.pagination;
        this.loading = false;
        for (let i = 0; i < this.expertReviewList.length; i++) {
          if (this.expertReviewList[i].current_step) {
            const expertReviewStage: any = this.expertReviewList[i].current_step.toUpperCase();
            let currentStep: any = ExpertReviewStepsNumber[expertReviewStage];
            this.currentExpertReviewStep[i] = currentStep;
          }
        }


      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    })
  }

  public get expertReviewStepNumber(): typeof ExpertReviewStepsNumber {
    return ExpertReviewStepsNumber;
  }

  addExpertReview() {
    localStorage.removeItem('current_expert_review_id');
    this.router.navigate([`/${this.userType}/add-expert-review`]);
  }

  viewAppraisalReport(id: any) {
    this.router.navigate([`/${this.userType}/orders/appraisal-report/${id}`])
  }

  continueProcess(expertReviewId: any) {
    localStorage.setItem('current_expert_review_id', expertReviewId);
    this.router.navigate([`/${this.userType}/add-expert-review`])
  }
}
