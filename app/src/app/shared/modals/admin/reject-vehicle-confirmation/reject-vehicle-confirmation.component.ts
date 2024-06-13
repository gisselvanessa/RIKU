import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AdminVehicleService } from 'src/app/modules/admin/admin-vehicles/admin-vehicles.service';
import { SuccessfullComponent } from '../../successfull/successfull.component';
@Component({
  selector: 'app-reject-vehicle-confirmation',
  templateUrl: './reject-vehicle-confirmation.component.html',
  styleUrls: ['./reject-vehicle-confirmation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RejectVehicleConfirmationComponent implements OnInit {
  @Input() public vehicleId: any;
  @Input() public approveRejectflg: boolean;
  @Input() public isFromListing: boolean = false;
  error_message: string;
  loading: boolean = false;

  constructor(
    private vehicleService: AdminVehicleService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void { }

  openApproveRejectConfirmation(approveReject: boolean) {
    if (this.vehicleId && approveReject) {
      this.loading = true;
      this.vehicleService
        .approveDisaproveVehicle({
          vehicle_id: this.vehicleId,
          is_approved: approveReject,
        })
        .subscribe(
          (response) => {
            this.loading = false;
            this.activeModal.dismiss(response);
            const modalRef = this.modalService.open(SuccessfullComponent, {
              windowClass: 'delete-vehicle-modal',
            });
            if (approveReject) {
              modalRef.componentInstance.approveSuccess = true;
            } else {
              modalRef.componentInstance.rejectSuccess = true;
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
        );
    } else {
      this.activeModal.dismiss({});
      this.router.navigate(['/admin/vehicles/vehicle-details/' + this.vehicleId + '/reject/']);
    }
  }
}
