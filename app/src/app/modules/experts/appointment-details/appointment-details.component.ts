import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { AppointmentDetails } from '../apoointment.model';
import { ExpertsService } from '../experts.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss'],
  encapsulation:ViewEncapsulation.None
})

export class AppointmentDetailsComponent implements OnInit {

  constructor(private activateRoute: ActivatedRoute, private location: Location,
    private router: Router, private expertService: ExpertsService,
    private toastr: ToastrService, private translate: TranslateService) { }
  expertReviewId: string;
  loading: boolean = false;
  appointmentDetails: AppointmentDetails;

  ngOnInit(): void {
    this.expertReviewId = this.activateRoute.snapshot.paramMap.get('id') || '';
    if (this.expertReviewId != '') {
      this.getAppointmentDetails();
    }
  }

  getAppointmentDetails() {
    this.loading = true;
    this.expertService.getAppointmentDetails(this.expertReviewId).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.appointmentDetails = resp.data;
        localStorage.setItem('expert_name',  this.appointmentDetails.expert_information.first_name + ' ' + this.appointmentDetails.expert_information.last_name)
        localStorage.setItem('expert_code', this.appointmentDetails.expert_information.expert_code)
        localStorage.setItem('vehicleInformation',JSON.stringify(this.appointmentDetails.vehicle_information))
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    })
  }

  back() {
    this.location.back();
  }

  scheduleMeeting(meetingStatus: any, id: any) {
    localStorage.setItem('typeOfMeeting', meetingStatus)
    setTimeout(() => {
      this.router.navigate([`/expert/schedule-appointment/${id}`])
    }, 1000);
  }

  addAppraisalReport(){
    this.router.navigate([`/expert/appraisal-report/add/${this.appointmentDetails.id}`])
  }

}
