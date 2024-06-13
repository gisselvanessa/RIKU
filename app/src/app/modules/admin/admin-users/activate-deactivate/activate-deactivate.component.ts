import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { ManageExpertsService } from '../../manage-experts/manage-experts.service';
import { TeamMembersService } from '../../team-members/team-members.service';
import { AdminUsersService } from '../admin-users.service';

@Component({
  selector: 'app-activate-deactivate',
  templateUrl: './activate-deactivate.component.html',
  styleUrls: ['./activate-deactivate.component.scss']
})
export class ActivateDeactivateComponent implements OnInit {
  error_message: any;

  constructor(public activeModal: NgbActiveModal,private translate:TranslateService, private manageExpertService: ManageExpertsService, private teamMemberService: TeamMembersService, private fb: FormBuilder, private adminUsers: AdminUsersService, private modalService: NgbModal) { }

  @Input() changeSuccessBtnText: string;
  @Input() public userId: any;
  @Input() userType: any;
  @Input() userStatus: any;
  loading: boolean = false;
  @Input() active: string;
  @Input() teamMemberId: string;
  @Input() statusTeamMember: string;
  @Input() expertId: string;
  @Input() expertStatus: boolean;

  ngOnInit(): void {
  }
  onSubmit() {
    if (this.userId) {
      let changedStatus = {
        user_id: this.userId,
        active: this.active,
        type: [this.userType]
      }
      this.adminUsers.updateStatus(changedStatus).subscribe((resp: any) => {
        this.activeModal.dismiss('confirm')
        this.loading = false;
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'delete-vehicle-modal ',
        });

        modalRef.componentInstance.userId = this.userId;
        modalRef.componentInstance.changedStatusValue = this.userStatus
        modalRef.componentInstance.changedStatusSuccess = true;
        modalRef.componentInstance.changeSuccessBtnText =
          this.changeSuccessBtnText;
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
      )

    }
    if (this.teamMemberId) {
      let changedStatus = {
        user_id: this.teamMemberId,
        active: this.active
      }
      this.teamMemberService.activateDeactivateMember(changedStatus).subscribe((resp: any) => {
        this.activeModal.dismiss('confirm')
        this.loading = false;
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'delete-vehicle-modal ',
        });

        modalRef.componentInstance.teamMemberId = this.teamMemberId;
        modalRef.componentInstance.changedStatusValue = this.statusTeamMember
        modalRef.componentInstance.changedStatusSuccess = true;
        modalRef.componentInstance.changeSuccessBtnText =
          this.changeSuccessBtnText;
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
      )
    }
    if (this.expertId) {
      let changedStatus = {
        user_id: this.expertId,
        active: this.active
      }
      this.manageExpertService.activateDeactivateExpert(changedStatus).subscribe((resp: any) => {
        this.loading = false;
        const expertEdit = this.translate.instant("Back to Expert Edit")
        const expertList = this.translate.instant("Back to Expert Listing")
        if (this.changeSuccessBtnText === expertEdit) {
          this.activeModal.dismiss('confirm')
        } else if (this.changeSuccessBtnText === expertList) {
          this.activeModal.dismiss('confirm')
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });

          modalRef.componentInstance.expertId = this.expertId;
          modalRef.componentInstance.changedStatusValue = this.expertStatus;
          modalRef.componentInstance.changedStatusSuccess = true;
          modalRef.componentInstance.changeSuccessBtnText =
            this.changeSuccessBtnText;
        }
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
      )
    }

  }

}
