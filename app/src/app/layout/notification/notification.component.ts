import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/modules/notifications/notification.service';
import { Error } from 'src/app/shared/models/error.model';

@Component({
  selector: 'app-notification-header',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {


  // notificationList and pagination variables
  notificationList: Array<any> = [];
  page: number = 1;
  limit: number = 10;
  loading: boolean = true;
  @Output() count: EventEmitter<number> = new EventEmitter;
  notificationListener: any;
  routeListener: any;

  constructor(
    private notificationService:NotificationService,
    private toastr: ToastrService,
    private userService:UserService,
    private router:Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    this.notificationListener = this.userService.updateNotification.subscribe(isChanged =>{
      if(isChanged) {
        this.getAllnotificationList({ page: this.page, limit: this.limit });
        this.getUnreadNotificationCount({ page: this.page, limit: this.limit, status:'unread' })
      };
    })

    this.routeListener = this.router.events.subscribe((value) => {
      if(value instanceof NavigationStart){
        if(this.userService.getUserId() && value.url !== "/auth/login" && value.url !== "/admin/login" ){
          this.getAllnotificationList({ page: this.page, limit: this.limit });
          this.getUnreadNotificationCount({ page: this.page, limit: this.limit, status:'unread' })
        }
      }
    });
  }

  //this function is used to get companies list
  getAllnotificationList(params: any): void {
    this.loading = true;
    this.notificationService.getNotificationList(params).subscribe({
      next: (res: any) => {
        this.notificationList = res.data.items ? res.data.items : [];
        this.loading = false;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        }
        // else {
        //   this.toastr.error(this.translate.instant('please accept the terms and conditions to proceed'));
        // }
      }
    });
  }

  //this function is used to get companies list
  getUnreadNotificationCount(params: any): void {
    this.notificationService.getNotificationList(params).subscribe({
      next: (res: any) => {
        const count =
          res.data.pagination.items_per_page && res.data.pagination.total_pages ?
          res.data.pagination.items_per_page * res.data.pagination.total_pages : 0;
        this.count.emit(count);
      }
    });
  }

  markAsReadSingle(data:any, index: number){
    //this.router.navigate([route]);
    this.notificationService.readNotification(data.id).subscribe({
      next: () => {
        this.notificationList[index].status = 'read';
        this.getUnreadNotificationCount({ page: this.page, limit: this.limit, status:'unread' })
      }
    });
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
      }else if(data.type === "EXPERT_REVIEW_PROCEDURE"){
        this.router.navigate([`/expert/appointment-details/${data.data.review_id}`]);
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

  ngOnDestroy(): void {
    this.routeListener.unsubscribe();
    this.notificationListener.unsubscribe();
  }
}
