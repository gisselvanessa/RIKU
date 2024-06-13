import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from "ngx-toastr";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-mobile-pre-approval',
  templateUrl: './mobile-pre-approval.component.html',
  styleUrls: ['./mobile-pre-approval.component.scss']
})

export class MobilePreApprovalComponent implements OnInit, OnDestroy {
  token: string | null;
  vehicleId: string | null;
  loading: boolean = false;
  orderId: string | null;
  loanId:string | null;
  expertReviewId:string | null;
  appraisalId:string | null;
  callerId: string | null;
  queryParams = {};
  subscription: Subscription;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private userService: UserService,
    private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams
    .subscribe(params => {
      this.queryParams = params;
    }
    );
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token') || null;
    this.vehicleId = this.activatedRoute.snapshot.queryParamMap.get('vehicle_id') || null;
    this.orderId = this.activatedRoute.snapshot.queryParamMap.get('order_id') || null;
    this.loanId = this.activatedRoute.snapshot.queryParamMap.get('loan_id') || null;
    this.expertReviewId = this.activatedRoute.snapshot.queryParamMap.get('current_expert_review_id') || null;
    this.appraisalId = this.activatedRoute.snapshot.queryParamMap.get('appraisal_id') || null;
    this.callerId = this.activatedRoute.snapshot.queryParamMap.get('caller_id') || null;
    if (this.token) {
      if (this.authService.isSignedin()) {
        this.userService.isFromMobile = true;
        this.userService.setUserType('buyer');
        this.redirectToPage();
      } else {
        this.getUserData();
      }
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  getUserData(): void{
    this.loading = true;
    this.authService.getUserDataFromToken(this.token).subscribe(
      (response) => {
        this.userService.isFromMobile = true;
        this.authService.setAccessTokenStorage(response.data.token);
        this.userService.setUserType('buyer');
        this.authService.changeLoggedIn(true);
        localStorage.setItem('username', response.data.user_name);
        const role = response.data.roles;
        localStorage.setItem('type', JSON.stringify(role))
        const userId = response.data.id;
        const userEmail = response.data.email;
        this.userService.setUserId(userId);
        this.userService.setUserEmail(userEmail);
        if (response.data.profile_img_url) {
          const userProfileImage = response.data.profile_img_url;
          this.userService.setUserProfileImage(userProfileImage)
        }
        this.userService.updateNotificationList(true);
        this.loading = false;
        this.redirectToPage();
      },
      ({ error, status }) => {
        this.loading = false;
        this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        this.router.navigate(['/auth/login']);
      }
    );
  }

  redirectToPage(){
    if (this.vehicleId) {
      localStorage.setItem('current_vehicle_id', this.vehicleId.toString());
      this.router.navigate(['/loan/pre-approval']);
    } else if (this.orderId) {
      if (this.expertReviewId) { // expert review with order
        localStorage.setItem('current_expert_review_id', this.expertReviewId.toString());
        localStorage.setItem('current_order_id', this.orderId.toString());
        this.router.navigate(['/buyer/add-expert-review']);
      } else {
        localStorage.setItem('current_order_id', this.orderId.toString());
        this.router.navigate([`/user/buyer-orders/add-order/${this.orderId}`]);
      }
    } else if (this.loanId) {
      localStorage.setItem('current_loan_id', this.loanId.toString());
      this.router.navigate(['/loan/loan-candidate-details']);
    } else if (this.expertReviewId) {  // standalone exper review
      localStorage.setItem('current_expert_review_id', this.expertReviewId.toString());
      this.router.navigate(['/buyer/add-expert-review']);
    } else if (this.appraisalId) {
      this.router.navigate([`/user/buyer-orders/appraisal-report/${this.appraisalId}`])
    } else if (this.callerId) {
       this.userService.callingDetails = Object.assign({}, this.queryParams);
       this.router.navigate(['/buyer/call']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
