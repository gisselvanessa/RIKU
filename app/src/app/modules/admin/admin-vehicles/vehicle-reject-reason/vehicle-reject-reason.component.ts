import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminVehicleService } from '../admin-vehicles.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';



@Component({
  selector: 'app-vehicle-reject-reason',
  templateUrl: './vehicle-reject-reason.component.html',
  styleUrls: ['./vehicle-reject-reason.component.scss'],
})
export class VehicleRejectReasonComponent implements OnInit {
  vehicleId: string;
  loading: any;
  error_message: any;
  rejectReason: string='';

  constructor(
    private activateroute: ActivatedRoute,
    private vehicleService: AdminVehicleService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private translate:TranslateService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.activateroute.snapshot.paramMap.get('id') || '';
  }

  rejectVehicle() {
    if(!this.rejectReason || this.rejectReason.trim() == ''){
      const message = this.translate.instant("Reject reason is required")
      this.toastr.error(message);
      return;
    }
    this.loading = true;
    this.vehicleService
      .approveDisaproveVehicle({
        vehicle_id: this.vehicleId,
        is_approved: false,
        rejection_reason: this.rejectReason
      })
      .subscribe(
        (response) => {
          this.loading = false;
          this.activeModal.dismiss(response);
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal',
          });
          modalRef.componentInstance.rejectSuccess = true;
          this.location.back();
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
