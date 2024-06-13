import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { Error } from 'src/app/shared/models/error.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-activate-deactivate',
  templateUrl: './activate-deactivate.component.html',
  styleUrls: ['./activate-deactivate.component.scss']
})
export class ActivateDeactivateComponent implements OnInit {


  @Input() notificationData: any;
  loading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal, 
    private modalService: NgbModal,
    private toastr: ToastrService,
    private notificationService: NotificationService,
    private translate:TranslateService
  ) { }
  
  ngOnInit(): void {}

  onSubmit() {
    if (this.notificationData.type === 'notification') {
      this.loading = true;
      this.notificationService.allowNotification().subscribe({
        next: (res: any) => {
          this.loading = false;
          this.activeModal.dismiss('confirm')
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.notificationStatus = true;
          modalRef.componentInstance.notificationStatusType = this.notificationData.is_allowed;
          modalRef.componentInstance.deleteSuccessBtnText = "OK";
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);          }
        }
      });
    }else if (this.notificationData.type === 'read') {
      this.loading = true;
      this.notificationService.readNotification('all').subscribe({
        next: (res: any) => {       
          this.loading = false;   
          this.activeModal.dismiss('read')
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.readNotifications = true;
          modalRef.componentInstance.deleteSuccessBtnText = "OK";
        },
        error: (errorRes: Error) => {
          this.loading = false;
          const error = errorRes.error;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);          }
        }
      });
    }else if (this.notificationData.type === 'delete') {
      this.loading = true;
      this.notificationService.deleteNotification('all').subscribe({
        next: (res: any) => {          
          this.loading = false;
          this.activeModal.dismiss('delete')
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.deleteNotifications = true;
          modalRef.componentInstance.deleteSuccessBtnText = "OK";
        },
        error: (errorRes: Error) => {
          this.loading = false;
          const error = errorRes.error;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);          }
        }
      });
    }

  }

}
