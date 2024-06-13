import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AddVehicleService } from '../../services/add-vehicle.service';
import { UserService } from '../../../shared/services/user.service';
import { AdminVehicleService } from 'src/app/modules/admin/admin-vehicles/admin-vehicles.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-successfull',
  templateUrl: './successfull.component.html',
  styleUrls: ['./successfull.component.scss'],
})
export class SuccessfullComponent implements OnInit, OnDestroy {
  @Input() public deleteSuccess: any;
  @Input() public changedStatusSuccess: any;

  @Input() public teamMemberaddedSuccess: any;
  @Input() public teamMemberId: string;

  @Input() public contactsuccessBtnText: string;

  @Input() public emailSuccessBtnText: string;

  @Input() public appraisalReportSuccess: any;

  @Input() public contentUpdatedSuccess: any;

  @Input() public expertId: string;

  @Input() public rejectSuccess: any;
  @Input() public approveSuccess: any;

  @Input() public loginSuccess: any;
  @Input() public passwordChanged: any;

  @Input() public unblockSuccessBtnText: any;


  @Input() public blockSuccessBtnText: any;


  @Input() public deleteSuccessBtnText: string;

  @Input() public draftSuccess: boolean = false;
  @Input() public submittedForApproval: boolean = false;
  @Input() public editedSuccess: boolean = false;
  @Input() public addUserSuccess: boolean = false;
  @Input() public userAddSuccessText: string = 'User Added!!';
  @Input() public addUserSuccessBtnText: string;
  @Input() public changeSuccessBtnText: string;
  @Input() public changedStatusValue: any;
  @Input() public userId: string;
  @Input() public companyDeleted: boolean;
  @Input() public companyAdded: boolean;

  @Input() public addBlogSuccess: boolean;
  @Input() public addBlogSuccessBtnText: string;
  @Input() public editBlogSuccess: boolean;
  @Input() public editBlogSuccessBtnText: boolean;
  @Input() public isRedirection: boolean;

  @Input() public roleDeleted: boolean = false;
  @Input() public roleAdded: boolean = false;
  @Input() public roleUpdated: boolean = false;
  @Input() public isRoleActivate: boolean = false;
  @Input() public isRoleStatusChanged: boolean = false;
  @Input() public editProfileType: boolean = false;
  @Input() public receiptUploaded: boolean = false;
  @Input() public OTPtype: boolean = false;
  @Input() public order_id: string = '';
  @Input() public paymentSuccess: boolean = false;
  @Input() public reviewPaymentSuccess: boolean = false;
  @Input() public cancelOrderSuccess: boolean = false;
  @Input() public procedureCancelSuccess: boolean = false;
  @Input() public cancelExpertReviewSuccess: boolean = false;
  @Input() public cancelLoanSuccess: boolean = false;

  @Input() public expertAdded: boolean = false;
  @Input() public expertUpdated: boolean = false;
  @Input() public readNotifications: boolean = false;
  @Input() public deleteNotifications: boolean = false;
  @Input() public notificationStatus: boolean = false;
  @Input() public notificationStatusType: boolean = false;


  public isShowCloseBtn: boolean = false;
  @Input() expertReviewId: string;

  @Input() blogDeleted: boolean = false;
  @Input() faqAdded: boolean = false;
  @Input() faqDeleted: boolean = false;
  @Input() faqType: string = "";
  @Input() blogStatus: boolean = false;
  @Input() blogStatusType: boolean = false;
  @Input() singleBlogDeleted: boolean = false;


  @Input() becomeType: string;
  @Input() becomeTypeStatus: boolean = false;
  @Input() registrationSuccess: boolean = false;
  @Input() orderId: string;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private addVehicleService: AddVehicleService,
    private adminVehicleService: AdminVehicleService,
    private userService: UserService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.isShowCloseBtn = this.deleteNotifications || this.readNotifications || this.addBlogSuccess || this.blogStatus || this.paymentSuccess || this.receiptUploaded || this.cancelExpertReviewSuccess || this.reviewPaymentSuccess || this.cancelOrderSuccess || this.procedureCancelSuccess || this.faqAdded ? false : true;
  }

  redirectPage() {

    const teamMemberAdded = this.translate.instant('Team member added successfully');
    const teamMemberUpdated = this.translate.instant('Team member updated successfully');
    const deleteSuccessBtnTeam = this.translate.instant('Back to Team Listing');
    const vehicleDeleted = this.translate.instant("Back to Vehicle Listing");
    const userListing = this.translate.instant("Back to User Listing");
    const userManagement = this.translate.instant("Back to User Management");
    const expertListing = this.translate.instant("Back to Expert Listing");
    const blogListing = this.translate.instant("Back to Blog Listing");
    const userType = this.passwordChanged || this.editProfileType ? '' : this.userService.getUserType();
    if (userType == 'seller') {
      this.addVehicleService.isVehicleDeleted.next(true);
      this.router.navigate(['/seller/vehicles']);
    } else if (userType == 'admin' || userType == 'super_admin') {
      if (this.deleteSuccessBtnText === vehicleDeleted) {
        this.adminVehicleService.isVehicleDeleted.next(true);
        this.router.navigate(['/admin/vehicles']);
      } else if (this.deleteSuccessBtnText === userListing ||
        this.addUserSuccessBtnText === userManagement || this.changeSuccessBtnText === userManagement || this.changeSuccessBtnText === userListing) {
        this.router.navigate(['/admin/users']);
      } else if (this.teamMemberaddedSuccess === teamMemberAdded || this.teamMemberaddedSuccess === teamMemberUpdated || this.deleteSuccessBtnText === deleteSuccessBtnTeam || this.changeSuccessBtnText === deleteSuccessBtnTeam) {
        this.router.navigate(['/admin/team-members/members-list'])
      } else if (this.roleAdded || this.roleDeleted) {
        this.router.navigate(['/admin/roles']);
      }
      else if (this.changeSuccessBtnText === expertListing || this.deleteSuccessBtnText === expertListing) {
        this.router.navigate(['/admin/experts'])
      }
      else if (this.addBlogSuccessBtnText === blogListing || this.deleteSuccessBtnText === blogListing) {
        this.router.navigate(['/admin/blog']);
      }
    } else if (userType == 'dealer') {
      this.addVehicleService.isVehicleDeleted.next(true);
      if (this.deleteSuccessBtnText === 'Back to Dashboard') {
        this.router.navigate(['/dealer/dashboard']);
      } else {
        this.router.navigate(['/dealer/vehicles']);
      }
    }
  }


  redirectAdminUserList() {
    this.router.navigate(['/admin/users']);
  }

  //redirec to admin experts list
  redirectAdminExperList() {
    this.router.navigate(['/admin/experts']);
  }

  //this function is used to redirect to the vehicles list page in admin module
  redirectAdminVehicleList() {
    this.router.navigate(['/admin/vehicles']);
  }

  //this function is used to redirect to the company list page in admin module
  redirectCompaniesList() {
    this.router.navigate(['/admin/companies']);
  }


  ngOnDestroy() {
    //when user click outside the screen after adding company successfully then it will also redirect to the company list page in admin module
    if (this.companyAdded) {
      this.redirectCompaniesList();
    } else if (this.roleAdded || this.roleUpdated || this.roleDeleted) {
      this.redirectRoleList();
    } else if (this.paymentSuccess || this.cancelOrderSuccess || this.procedureCancelSuccess) {
      this.redirectOrderProcess();
    } else if (this.receiptUploaded) {
      this.redirectToOrder();
    } else if (this.reviewPaymentSuccess || this.cancelExpertReviewSuccess) {
      this.redirectExpertReviewProcess();
    } else if (this.expertAdded || this.expertUpdated) {
      this.redirectAdminExperList();
    }
  }

  redirectOrderProcess() {
    if (this.paymentSuccess || this.procedureCancelSuccess) {
      this.router.navigate([`/user/buyer-orders/add-order/${this.orderId}`]); // cambio redireccion para rol usuario
      return;
    }
    this.router.navigate([`/${this.userService.getUserType()}/orders`]);
  }

  redirectExpertReviewProcess() {
    const userType = this.userService.getUserType()
    if (this.reviewPaymentSuccess) {
      this.router.navigate([`/${userType}/add-expert-review`]);
      return;
    }
    this.router.navigate([`/${userType}/expert-reviews`]);
  }

  redirectRoleList() {
    this.router.navigate(['/admin/roles']);
  }

  //this function is used to redirect user's profile page
  redirectToProfile() {
    this.userService.redirectToProfile();
  }

  //this function is used to redirect to order details page
  redirectToOrder() {
    if (this.order_id && this.expertReviewId) {
      const route = '/user/buyer-orders/order-details/' + this.order_id;
      this.router.navigate([route])
    } else if (this.order_id) {
      const route = '/user/buyer-orders/order-details/' + this.order_id;
      this.router.navigate([route])
    } else if (this.expertReviewId) {
      const route = `/${this.userService.getUserType()}/expert-review-details/${this.expertReviewId}`;
      this.router.navigate([route])
    }
  }

  redirectToChat() {
    const userType = this.userService.getUserType()
    if (userType === 'buyer') {
      this.router.navigate(['/buyer/chat-user'])
    } else if (userType === 'user') {
      this.router.navigate(['/user/chat-user'])
    } else if (userType === 'seller') {
      this.router.navigate(['/seller/chat-user'])
    } else if (userType === 'dealer') {
      this.router.navigate(['/dealer/chat-user'])
    }
  }

  redirectToFaqList() {
    this.router.navigate(['/admin/faq'])
  }

  redirectToBlogList() {
    this.router.navigate(['/admin/blog'])
  }
}
