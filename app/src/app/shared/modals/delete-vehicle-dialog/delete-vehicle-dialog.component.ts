import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { AdminVehicleService } from 'src/app/modules/admin/admin-vehicles/admin-vehicles.service';
import { DealerVehiclesService } from 'src/app/modules/dealers/dealer-vehicles/dealer-vehicles.service';
import { Error } from '../../models/error.model';


@Component({
  selector: 'app-delete-vehicle-dialog',
  templateUrl: './delete-vehicle-dialog.component.html',
  styleUrls: ['./delete-vehicle-dialog.component.scss']
})

export class DeleteVehicleDialogComponent implements OnInit {

  vehicleId: string;
  loading: boolean = false;
  errorMessage: any;
  isFromDealer: boolean = false;

  constructor(private adminVehicleService: AdminVehicleService,
    private modalService: NgbModal, private toastr: ToastrService,
    public activeModal: NgbActiveModal, private translate:TranslateService, private dealerVehiclesService: DealerVehiclesService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true;
    const apiEndPoint = this.isFromDealer ? this.dealerVehiclesService.deleteVehicle(this.vehicleId) : this.adminVehicleService.deleteVehicle(this.vehicleId);

    apiEndPoint
      .subscribe((resp: any) => {
        this.activeModal.close(true);
      }, (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
      );
  }

}
