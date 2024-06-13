import { Location } from '@angular/common';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddOrderConstants } from 'src/app/shared/constant/add-order-constants';
import { Error } from 'src/app/shared/models/error.model';
import { ScheduleAppointment } from '../apoointment.model';
import { ExpertsService } from '../experts.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ScheduleAppointmentComponent implements OnInit, AfterViewInit {

  constructor(private location: Location,private router:Router,private translate:TranslateService, private ngZone: NgZone, private datePipe: DatePipe, private toastr: ToastrService, private fb: FormBuilder, private activateRoute: ActivatedRoute, private expertService: ExpertsService) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  minDate = new Date();
  timeList: Array<string> = AddOrderConstants.timeList;
  typeOfMeeting: any;
  appointmentForm: FormGroup;
  appointmentDetails: ScheduleAppointment = new ScheduleAppointment();
  searchTime: string;
  loading: boolean = false;
  @ViewChild('meetingLocation') meetingLocation: any;
  isSubmitted: boolean = false;
  // parish: string = '';
  // city: string = '';
  // province: string = '';
  country: string = '';
  expertReviewId: any;
  // latitude: number;
  // longitude: number;
  provinceList: Array<string> = [];
  cityList: Array<string> = [];
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  parishList: Array<string> = [];

  ngOnInit(): void {
    this.expertReviewId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.typeOfMeeting = localStorage.getItem('typeOfMeeting')
    this.provinceListing()
    this.appointmentForm = this.fb.group(
      {
        meeting_date: ['', [Validators.required]],
        meeting_time: ['', [Validators.required]],
        parish: ['', [Validators.required]],
        city: ['', [Validators.required]],
        province: ['', [Validators.required]],
        meeting_location:['', Validators.required]
      }
    );
  }

  provinceListing(){
    this.expertService.getProvinceList().subscribe((resp: any) => {
      this.provinceList = resp.data;
    });
  }

  back() {
    this.location.back()
  }


  setMeetingTime(event: any) {
    // this.meetingDetailForm.controls['meeting_time'].patchValue(event.target.value);
    this.appointmentForm.controls['meeting_time'].patchValue(event.target.value);
  }

  ngAfterViewInit(): void {
    this.__setMeetingLocation();
  }

  setProvice(province: string) {
    this.appointmentForm.controls['province'].setValue(province)
    this.searchProvince = '';
    this.parishList = [];
    this.appointmentForm.controls['city'].setValue('');
    this.appointmentForm.controls['parish'].setValue('');
    this.expertService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.appointmentForm.controls['city'].setValue(city);
    this.appointmentForm.controls['parish'].setValue('');
    this.searchCity = '';
    this.expertService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.appointmentForm.controls['parish'].setValue(parish);
    this.searchParish = '';
  }


  private __setMeetingLocation() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.meetingLocation?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlace();
        this.fillInAddress(place, true);
      });
    });
  }



  public fillInAddress(place: any, isAddress: boolean = false) {
    try {
      //Reference Url:  https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
      let address1 = "";
      let province = '';
      let city = '';
      let parish = '';
      let country = '';
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        const componentType = component.types[0];
        switch (componentType) {
          case "street_address": {
            address1 += `${component.long_name}`;
            break;
          }
          case "point_of_interest": {
            address1 += `${component.long_name}`;
            break;
          }
          case "establishment": {
            address1 += `${component.long_name}`;
            break;
          }
          case "street_number": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "route": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "sublocality_level_3":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_2":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_1":
            parish = component.long_name;
            if (isAddress) {
              // this.parish = parish;
            }
            break;
          case "sublocality":
            parish = component.long_name;
            if (isAddress) {
              // this.parish = parish;
            }
            break;
          case "locality":
            city = component.long_name;
            if (isAddress) {
              // this.city = city;
            }
            break;
          case "administrative_area_level_1":
            // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            province = component.long_name;
            if (isAddress) {
              // this.province = province;
            }
            break;
          case "administrative_area_level_2":
            province = component.long_name;
            if (isAddress) {
              // this.province = province;
            }
            break;
          case "political":
            province = component.long_name;
            if (isAddress) {
              // this.province = province;
            }
            break;
          case "country":
            if (isAddress) {
              country = component.long_name;
              this.country = country;
            }
            break;
        }
      }
      if (parish != '') {
        address1 += ',' + parish;
      }
      if (city != '') {
        address1 += ',' + city;
      }
      if (province != '') {
        address1 += ',' + province;
      }
      if (country != '') {
        address1 += ',' + country;
      }
      isAddress ? this.appointmentForm.controls['meeting_location'].patchValue(address1) : this.appointmentForm.controls['meeting_location'].setValue(address1);
    } catch (ex) {
    }
  }
  submitAppointmentDetails() {
    if (this.appointmentForm.invalid) {
      return;
    }
    this.appointmentDetails.expert_review_id = this.expertReviewId;
    // this.appointmentDetails.date = this.datePipe.transform(this.appointmentForm.value.meeting_date, 'dd/MM/YYYY');
    this.appointmentDetails.date = this.appointmentForm.value.meeting_date;
    this.appointmentDetails.time = this.appointmentForm.value.meeting_time;
    this.appointmentDetails.address.address = this.appointmentForm.value.meeting_location
    // if (this.latitude) {
    //   this.appointmentDetails.lat = this.latitude;
    // }
    // if (this.longitude) {
    //   this.appointmentDetails.lng = this.longitude;
    // }

      this.appointmentDetails.address.parish = this.appointmentForm.controls['parish'].value;
      this.appointmentDetails.address.city = this.appointmentForm.controls['city'].value;
      this.appointmentDetails.address.province = this.appointmentForm.controls['province'].value;

    // const additionalAddress = this.appointmentForm.value.additional_address;
    // if (additionalAddress && additionalAddress.trim() != '') {
    //   this.appointmentDetails.additional_address = additionalAddress;
    // }
    this.expertService.postScheduleAppointment(this.appointmentDetails).subscribe({
      next: (resp: any) => {
        if(resp.success_code === 'EXPERT_APPOINTMENT_SCHEDULED'){
          this.toastr.success(resp.message)
          setTimeout(() => {
            this.router.navigate(['/expert/appointments'])
          }, 1000);
        }
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

}
