import { Location, TitleCasePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { Error } from 'src/app/shared/models/error.model';
import { ExpertsService } from '../../experts.service';
import { PageName } from '../report.mode';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-appraisal-report',
  templateUrl: './add-appraisal-report.component.html',
  styleUrls: ['./add-appraisal-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TitleCasePipe]
})
export class AddAppraisalReportComponent implements OnInit {

  loading = false;
  appraisallDetails: any = {};
  appraisallId: any;
  selectAccordian: any = '';
  mydetails: any;
  vehicleInfo: any;
  page = PageName;
  stepsCompleted: any[] = [];
  status: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private expertService: ExpertsService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private location: Location,
    private titleCase: TitleCasePipe,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.appraisallId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getAppraisalReport();
  }

  //this function is used to get appraisall details
  getAppraisalReport(): void {
    this.expertService.getAppraisalDetails(this.appraisallId).subscribe({
      next: (res: any) => {
        this.loading = true;
        this.appraisallDetails = res.data;
        if (this.appraisallDetails.my_details != null) {
          this.mydetails = this.appraisallDetails.my_details
          this.stepsCompleted.push('MY_DETAILS')
        }
        if (this.appraisallDetails.expert_review != null) {
          this.status = this.appraisallDetails.expert_review.status
        }
        if (this.appraisallDetails.vehicle_info != null) {
          this.vehicleInfo = this.appraisallDetails.vehicle_info
          this.stepsCompleted.push('VEHICLE_INFO')
        }
        if (this.appraisallDetails.body_work != null) {
          this.stepsCompleted.push('BODY_WORK')
        }
        if (this.appraisallDetails.customer_info != null) {
          this.stepsCompleted.push('CUSTOMER_INFO')
        }
        if (this.appraisallDetails.external_operation) {
          this.stepsCompleted.push('EXTERNAL_OPERATION')
        }
        if (this.appraisallDetails.inside_the_vehicle) {
          this.stepsCompleted.push('INSIDE_THE_VEHICLE')
        }
        if (this.appraisallDetails.interior_operation_of_the_vehicle) {
          this.stepsCompleted.push('INTERIOR_OPERATION_OF_THE_VEHICLE')
        }
        if (this.appraisallDetails.engine) {
          this.stepsCompleted.push('ENGINE')
        }
        if (this.appraisallDetails.electric_system) {
          this.stepsCompleted.push('ELECTRIC_SYSTEM')
        }
        if (this.appraisallDetails.tires) {
          this.stepsCompleted.push('TIRES')
        }
        if (this.appraisallDetails.leaks) {
          this.stepsCompleted.push('LEAKS')
        }
        if (this.appraisallDetails.front_train_and_suspension) {
          this.stepsCompleted.push('FRONT_TRAIN_AND_SUSPENSION')
        }
        if (this.appraisallDetails.road_test) {
          this.stepsCompleted.push('ROAD_TEST')
        }
        if (this.appraisallDetails.additional_accessories) {
          this.stepsCompleted.push('ADDITIONAL_ACCESSORIES')
        }
        if (this.appraisallDetails.vehicle_approval) {
          this.stepsCompleted.push('VEHICLE_APPROVAL')
        }
        if (this.appraisallDetails.security_approval) {
          this.stepsCompleted.push('SECURTITY_APPROVAL')
        }
        if (this.appraisallDetails.additional_annex) {
          this.stepsCompleted.push('ADDITIONAL_ANNEX')
        }
        if (this.appraisallDetails.auth_sign) {
          this.stepsCompleted.push('AUTH_SIGN')
        }
      },
      error: (errorRes: Error) => {
        this.loading = true;
        const error = errorRes.error;
        this.appraisallDetails = {};
        if (error?.error_code !== "APPRAISAL_REPORT_DETAILS_NOT_FOUND") {
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      }
    })
  }

  selectedAccordian(accordianName: any) {
    this.selectAccordian = accordianName;
  }
  back() {
    this.location.back()
  }

  saveData(data: any) {
    if (this.stepsCompleted.indexOf(data.current_step) === -1) {
      this.stepsCompleted.push(data.current_step)
    }
    console.log(data.current_step)
    const currentStep = this.titleCase.transform((data.current_step).replaceAll("_", " "))
    console.log(currentStep)
    let formData: any = {}
    formData = data;
    formData.expert_review_id = this.appraisallId;
    if (data.current_step === 'VEHICLE_APPROVAL') {
      if (this.appraisallDetails.my_details != null) {
        formData = { ...formData, ...this.appraisallDetails.my_details }
      }
      if (this.appraisallDetails.vehicle_info != null) {
        formData = { ...formData, ...this.appraisallDetails.vehicle_info }
      }
      if (this.appraisallDetails.body_work != null) {
        formData.body_work = this.appraisallDetails.body_work
      }
      if (this.appraisallDetails.customer_info != null) {
        formData = { ...formData, ...this.appraisallDetails.customer_info }
      }
      if (this.appraisallDetails.external_operation != null) {
        formData.external_operation = this.appraisallDetails.external_operation
      }
      if (this.appraisallDetails.inside_the_vehicle != null) {
        formData.inside_the_vehicle = this.appraisallDetails.inside_the_vehicle
      }
      if (this.appraisallDetails.interior_operation_of_the_vehicle != null) {
        formData.interior_operation_of_the_vehicle = this.appraisallDetails.interior_operation_of_the_vehicle
      }
      if (this.appraisallDetails.engine != null) {
        formData.engine = this.appraisallDetails.engine
      }
      if (this.appraisallDetails.electric_system != null) {
        formData.electric_system = this.appraisallDetails.electric_system
      }
      if (this.appraisallDetails.tires != null) {
        formData.tires = this.appraisallDetails.tires
      }
      if (this.appraisallDetails.leaks != null) {
        formData.leaks = this.appraisallDetails.leaks
      }
      if (this.appraisallDetails.front_train_and_suspension != null) {
        formData.front_train_and_suspension = this.appraisallDetails.front_train_and_suspension
      }
      if (this.appraisallDetails.road_test != null) {
        formData.road_test = this.appraisallDetails.road_test
      }
      if (this.appraisallDetails.additional_accessories != null) {
        formData.additional_accessories = this.appraisallDetails.additional_accessories
      }
    } else {
      formData = formData
    }

    //then save api called;
    this.expertService.postAppraisalDetails(formData).subscribe({
      next: (resp) => {
        this.selectAccordian = ''
        if (data.current_step === 'VEHICLE_APPROVAL') {
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.appraisalReportSuccess = 'Appraisal Report Created Successfully.'

          modalRef.result.then().catch((resp: any) => {
            if (resp === 'ok') {
              this.router.navigate([`/expert/appraisal-report/view/${this.appraisallId}`])
            } else {
              this.router.navigate([`/expert/appraisal-report/view/${this.appraisallId}`])
            }
          })

        } else {
          const step:any = this.translate.instant(`${currentStep}`)
          const savedSuccessfully = this.translate.instant('Saved Successfully')
          this.toastr.success(step + ' ' +savedSuccessfully)
          this.getAppraisalReport()
        }
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    })
  }

  ngOnDestroy() {
    localStorage.removeItem('vehicleInformation')
    localStorage.removeItem('expert_name')
    localStorage.removeItem('expert_code')
  }

}
