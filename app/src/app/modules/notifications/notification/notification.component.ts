import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { PaginationData } from 'src/app/shared/models/pagination.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivateDeactivateComponent } from '../activate-deactivate/activate-deactivate.component';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  // notificationList and pagination variables
  notificationList: Array<any> = [];
  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();
  isPublished : boolean;

  //loading variable
  loading: boolean = true;

  allFilterParams: any = {};

  constructor(
    private notificationService:NotificationService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router:Router,
    private userService: UserService,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {

    this.notificationService.getNotificationStatus().subscribe({
      next: (resp: any) => {
       this.isPublished = resp.data.allow_notification;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
    })

    //according the screen size getting the company list
    if (window.innerWidth < 768) {
      this.limit = 10;
      this.getAllNotificationList({ page: this.page, limit: this.limit });
    } else {
      this.limit = 15;
      this.getAllNotificationList({ page: this.page, limit: this.limit });
    }

    this.userService.readNotification.subscribe({
      next: (res) => {
        if(res) this.notificationList.map((ele)=>  ele.id === res ? ele.status = 'read' : ele );
      }
    });
  }

  //this function is used to get companies list
  getAllNotificationList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.notificationService.getNotificationList(this.allFilterParams).subscribe({
      next: (res: any) => {
        this.notificationList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);        }
      }
    });
  }

  //this function is called if pagination changed
  jumpToThePage(page:number){
    this.page = page;
    this.allFilterParams.page = page;
    this.getAllNotificationList( this.allFilterParams);
    if(this.page == 1) this.userService.updateNotificationList(true);
  }

  allowNotification(event:any){
    let params: any = {};
    params.is_allowed = event.target.checked;
    params.type = 'notification';
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.notificationData = params;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'confirm') {
        this.isPublished = event.target.checked;
      }else{
        event.target.checked = !event.target.checked;
      }
    })
  }

  markAsReadSingle(data:any, index: number){
    //this.router.navigate([route]);
    this.notificationService.readNotification(data.id).subscribe({
      next: () => {
        this.notificationList[index].status = 'read';
      }
    });
    //In case no routing is there then use it
    this.userService.updateNotificationList(true);

    const userType = this.userService.getUserType();
    if(userType === 'buyer' || userType === 'seller' || userType === 'dealer'){
      if (data.type === "PROFILE") {
        this.router.navigate([`/${userType}/my-profile`]);
      } else if (data.type === "FAVORITE_VEHICLE") {
        this.router.navigate([`/${userType}/vehicles/vehicle-details/${data.data.vehicle_id}`]);
      } else if (data.type === "VEHICLE_ORDER" || data.type === "VEHICLE_PROCEDURE") {
        this.router.navigate([`/${userType}/orders/order-details/${data.data.order_id}`]);
      } else if (data.type === 'EXPERT_REVIEW_PROCEDURE') {
        if (userType === 'seller' || userType === 'dealer') {
          this.router.navigate([`/user/seller-orders/order-details/${data.data.order_id}`]);
        } else {
          this.router.navigate([`/${userType}/expert-review-details/${data.data.review_id}`]);
        }
      } else if (data.type === "CALL_SERVICE" || data.type === "CHAT_NEW_MESSAGE") {
        this.router.navigate([`/${userType}/chat-user`]);
      } else {
        this.userService.readNotification.next(data.id);
      }
    }
    // else if(userType === 'seller'){
    //   if(data.type === "PROFILE"){
    //     this.router.navigate(['/seller/my-profile']);
    //   }else if(data.type === "VEHICLE_ORDER" || data.type === "VEHICLE_PROCEDURE" || data.type === 'EXPERT_REVIEW_PROCEDURE'){
    //     this.router.navigate([`/seller/orders/order-details/${data.data.order_id}`]);
    //   }else if(data.type === "CALL_SERVICE"){
    //     this.router.navigate([`/seller/chat-user`]);
    //   }else{
    //     this.userService.readNotification.next(data.id);
    //   }
    // }
    // else if(userType === 'dealer'){
    //   if(data.type === "PROFILE"){
    //     this.router.navigate(['/dealer/my-profile']);
    //   }else if(data.type === "VEHICLE_ORDER" || data.type === "VEHICLE_PROCEDURE" || data.type === 'EXPERT_REVIEW_PROCEDURE'){
    //     this.router.navigate([`/dealer/orders/order-details/${data.data.order_id}`]);
    //   }else if(data.type === "CALL_SERVICE"){
    //     this.router.navigate([`/dealer/chat-user`]);
    //   }else{
    //     this.userService.readNotification.next(data.id);
    //   }
    // }
    else if(userType === 'expert'){
      if(data.type === "PROFILE"){
        this.router.navigate(['/admin/view-profile']);
      }else{
        this.userService.readNotification.next(data.id);
      }
    }
    else if(userType === 'admin' || userType === 'super_admin'){
      if(data.type === "PROFILE" || data.type ==='TEAM_MEMBER_PROFILE'){
        this.router.navigate(['/admin/view-profile']);
      }else if(data.type === "VEHICLE_ORDER" || data.type === "VEHICLE_PROCEDURE" || data.type === 'EXPERT_REVIEW_PROCEDURE'){
        this.router.navigate([`/admin/orders/details/${data.data.order_id}`]);
      }else if(data.type === "MANAGE_VEHICLE"){
        this.router.navigate([`/admin/vehicles/vehicle-details/${data.data.vehicle_id}`]);
      }else if(data.type === "CONTACT_US_INQUIRY"){
        this.router.navigate([`/admin/manage-contact-us/view-detail/${data.data.cn_id}`]);
      }else{
        this.userService.readNotification.next(data.id);
      }
    }
  }

  markAsReadAll(){
    let params: any = {};
    params.type = 'read';
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.notificationData = params;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'read') {
        this.userService.updateNotificationList(true);
        this.notificationList.forEach(ele => ele.status = 'read');
      }
    })
  }

  deleteAll(){
    let params: any = {};
    params.type = 'delete';
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.notificationData = params;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'delete') {
        this.userService.updateNotificationList(true);
        this.notificationList = [];
      }
    })
  }
}
