import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


import { Error } from 'src/app/shared/models/error.model';
import { VehicleProcedureService } from 'src/app/shared/services/vehicle-procedure.service';

@Component({
  selector: 'app-cancel-procedure-dialog',
  templateUrl: './cancel-procedure-dialog.component.html',
  styleUrls: ['./cancel-procedure-dialog.component.scss']
})
export class CancelProcedureDialogComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private vehicleProcedureService: VehicleProcedureService, private toastr: ToastrService) { }

  @Input() vehicleProcedureId: string;
  @Input() currentStage: string;
  loading: boolean = false;

  ngOnInit(): void {
  }


  onSubmit() {
    this.loading = true;
    const data = {
      vp_id: this.vehicleProcedureId,
      current_stage: this.currentStage
    }
    this.vehicleProcedureService.cancelProcedure(data).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong, Please Try again later');
        }
        this.activeModal.close(false);
      }
    });
  }
}

