import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { AdminVehicleProcedureService } from '../admin-vehicle-procedure.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-admin-vehicle-procedure-details',
  templateUrl: './admin-vehicle-procedure-details.component.html',
  styleUrls: ['./admin-vehicle-procedure-details.component.scss']
})
export class AdminVehicleProcedureDetailsComponent implements OnInit, OnDestroy {
  step = 0;
  orderId = "";
  loading = false;
  vehicleProcedureData: any = [];
  highlightedStep = 0;
  currentCompletedStep: any;
  status: string;
  vehicleProcedureId: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private adminVehicleProcedureService: AdminVehicleProcedureService,
    public location: Location,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.vehicleProcedureId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getVehicleProcedureDetails();
  }

  //this function is used to get vehicle procedure data
  getVehicleProcedureDetails() {
    this.adminVehicleProcedureService.getVehicleProcedureData(this.vehicleProcedureId).subscribe({
      next: (res: any) => {
        this.vehicleProcedureData = res.data;
        const step = this.vehicleProcedureData.status === 'completed' ? 7 : res.data.steps.length - 1;
        this.step = step;
        this.currentCompletedStep = step;
        this.status = this.vehicleProcedureData.status;
        this.highlightedStep = step;
        if (this.highlightedStep === 7) this.highlightedStep = 0;
        this.loading = true;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = true;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    });
  }

  updateStatus(status: any) {
    if (status) this.status = 'completed';
  }

  viewScreenAsPerCurrentStep(step: any) {
    this.step = step;
  }

  highlightedScreen(highlightedStep: any) {
    this.highlightedStep = highlightedStep;
  }

  currentCompletedSteps(step: any) {
    this.currentCompletedStep = step;
  }

  ngOnDestroy(): void {
    this.vehicleProcedureData = null;
  }
}
