import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessfullComponent } from '../successfull/successfull.component';
import { AddVehicleService } from '../../services/add-vehicle.service';
import { AdminVehicleService } from 'src/app/modules/admin/admin-vehicles/admin-vehicles.service';
import { AdminUsersService } from 'src/app/modules/admin/admin-users/admin-users.service';
import { DealerVehiclesService } from 'src/app/modules/dealers/dealer-vehicles/dealer-vehicles.service';
import { TeamMembersService } from 'src/app/modules/admin/team-members/team-members.service';
import { TwilioService } from '../../services/twilio.service';
import { ManageExpertsService } from 'src/app/modules/admin/manage-experts/manage-experts.service';
import { BlogService } from 'src/app/modules/admin/blog/blog.service';
import { FaqService } from 'src/app/modules/admin/faq/faq.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeleteConfirmationComponent implements OnInit {
  @Input() public vehicleId: any;
  @Input() public userId: any;
  error_message: any;
  loading: boolean = false;
  @Input() isFromAdmin: boolean = false;
  @Input() isFromDealer: boolean = false;
  @Input() deleteSuccessBtnText: string = 'Back to Vehicle Listing';
  @Input() user_type: any[] = [];
  @Input() conversationId: any;

  @Input() expertId: string;


  @Input() blockUserId: any;
  @Input() blockAction: any[] = [];
  @Input() blockSuccessBtnText: string;

  @Input() unblockUserId: any;
  @Input() blockStatusId: any[] = [];
  @Input() unblockSuccessBtnText: string;

  @Input() teamMemberId: string;

  @Input() blogId: string;
  @Input() faqId: string;


  constructor(
    private vehicleService: AddVehicleService,
    private adminVehicleService: AdminVehicleService,
    private dealerVehicleService: DealerVehiclesService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private adminUserService: AdminUsersService,
    private teamMemberService: TeamMembersService,
    private twilioService: TwilioService,
    private expertService:  ManageExpertsService,
    private blogService: BlogService,
    private faqService: FaqService,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {}

  openDeleteConfirmation() {
    if (this.vehicleId) {
      this.loading = true;
      let deleteVehicleApi;
      if (this.isFromDealer) {
        deleteVehicleApi = this.dealerVehicleService.deleteVehicle(
          this.vehicleId
        );
      } else {
        deleteVehicleApi = this.isFromAdmin
          ? this.adminVehicleService.deleteVehicle(this.vehicleId)
          : this.vehicleService.deleteVehicle(this.vehicleId);
      }

      deleteVehicleApi.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss(response);
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.deleteSuccess = true;
          modalRef.componentInstance.deleteSuccessBtnText = this.deleteSuccessBtnText;
        },
        ({ error, status }) => {
          this.loading = false;

          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    } else if (this.userId) {
      this.loading = true;
      this.adminUserService.deleteUser(this.userId, this.user_type)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss(response);
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.deleteSuccess = true;
          modalRef.componentInstance.deleteSuccessBtnText =
            this.deleteSuccessBtnText;
          this.adminUserService.isRoleDeleted.next({ user_id: this.userId, type: this.user_type })
        },
        ({ error, status }) => {
          this.loading = false;

          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          } 
        }
      );
    } else if (this.teamMemberId) {
      this.loading = true;
      this.teamMemberService.deleteTeamMember(this.teamMemberId)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss(response);
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.deleteSuccess = true;
          modalRef.componentInstance.deleteSuccessBtnText =
            this.deleteSuccessBtnText;
          this.teamMemberService.isTeamMemberDeleted.next(true)
        },
        ({ error, status }) => {
          this.loading = false;

          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    } else if (this.conversationId) {
      this.loading = true;
      this.twilioService.deleteChatConversation(this.conversationId)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss('deleted');
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.deleteSuccess = true;
          modalRef.componentInstance.deleteSuccessBtnText =
            this.deleteSuccessBtnText;
        },
        ({ error, status }) => {
          this.loading = false;

          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    } else if (this.expertId) {
      this.loading = true;
      this.expertService.deleteExpert(this.expertId)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss('deleted');
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.deleteSuccessBtnText =
            this.deleteSuccessBtnText;
          this.expertService.isExpertDeleted.next(true)
        },
        ({ error, status }) => {
          this.loading = false;

          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    } else if (this.blogId) {
      this.loading = true;
      this.blogService.deleteBlog(this.blogId)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.close(true);
        },
        ({ error, status }) => {
          this.loading = false;
          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    } else if (this.faqId){
      this.loading = true;
      this.faqService.deleteFAQ(this.faqId)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.close(true);
        },
        ({ error, status }) => {
          this.loading = false;
          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    }
  }

  openBlockConfirmation() {
    if (this.blockUserId) {
      this.loading = true;
      this.twilioService.blockUser(this.blockUserId, this.blockAction)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss('userBlocked');
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });

          modalRef.componentInstance.blockSuccessBtnText =
            this.blockSuccessBtnText;
        },
        ({ error, status }) => {
          this.loading = false;

          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    } else if (this.unblockUserId) {
      this.loading = true;
      this.twilioService.unBlockUser(this.blockStatusId)?.subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss('userUnblocked');
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });

          modalRef.componentInstance.unblockSuccessBtnText =
            this.unblockSuccessBtnText;
        },
        ({ error, status }) => {
          this.loading = false;

          if (error.error) {
            error.error.forEach((message: any) => {
              this.error_message = message;
            });
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.error_message = message;
          }
        }
      );
    }
  }
}
