import { Component, OnInit, AfterViewInit, ViewChild, NgZone, EventEmitter, Output, Input, OnChanges, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { AddOrderConstants, OrderStages, OrderStepsNumber } from '../../../../../shared/constant/add-order-constants';
import { Order, ScheduleMeeting } from '../../buyer-order.model';
import { BuyerOrdersService } from '../../buyer-orders.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})

export class ScheduleMeetingComponent implements OnInit, AfterViewInit {

  @Input() currentStep: number;
  @Output() onSubmitDetails: EventEmitter<{orderDetail: Order, nextStep: number}> = new EventEmitter();
  @Input() currentOrder: Order;
  @ViewChild('scheduledMeeting') scheduledMeeting: TemplateRef<any>;

  minDate = new Date();
  timeList: Array<string> = AddOrderConstants.timeList;
  orderStage:any = AddOrderConstants.orderStages;
  meetingDetailForm: FormGroup;
  searchTime: string;
  loading: boolean = false;
  @ViewChild('meetingLocation') meetingLocation: any;
  @ViewChild('optionalAddress') optionalAddress: any;
  isSubmitted: boolean = false;
  scheduleMeetingData: ScheduleMeeting = new ScheduleMeeting();
  parish: string = '';
  city: string = '';
  province: string = '';
  country: string = '';
  completedStep: number = 0;
  modalRef: any;

  constructor(private fb: FormBuilder, private ngZone: NgZone,
    private buyerOrdersService: BuyerOrdersService, private toastr: ToastrService,
    private translate: TranslateService, private modalService: NgbModal) {
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.meetingDetailForm = this.fb.group(
      {
        meeting_date: ['',[Validators.required]],
        meeting_time: ['',[Validators.required]],
        meeting_location: ['',[Validators.required]],
        additional_address: ['']
      }
    );
    if(this.currentOrder.meetings.length > 0) {
      console.log('this.currentOrder.meetings: ', JSON.stringify(this.currentOrder.meetings[this.currentOrder.meetings.length - 1], null, 2))
      this.patchValues();
      if (this.currentOrder.meetings[this.currentOrder.meetings.length - 1].is_accepted == true) {
        this.completedStep = OrderStepsNumber.VEHICLE_REVIEW;
      }
    }
    if(this.currentOrder.seller.type.indexOf('dealer')> -1){
      if(this.currentOrder.seller.location?.address){
        this.meetingDetailForm.controls['meeting_location'].patchValue(this.currentOrder.seller.location.address);
      }else{
        this.city = this.currentOrder.seller.location.city;
        this.parish = this.currentOrder.seller.location.parish;
        this.province = this.currentOrder.seller.location.province;
        const address = `${this.city}, ${this.parish}, ${this.province}`;
        this.meetingDetailForm.controls['meeting_location'].patchValue(address);
      }

    }

  }

  patchValues(){
    this.meetingDetailForm.controls['meeting_date'].patchValue(new Date(this.currentOrder.meetings[this.currentOrder.meetings.length - 1].date));
    this.meetingDetailForm.controls['meeting_time'].patchValue(this.currentOrder.meetings[this.currentOrder.meetings.length - 1].time);
    this.meetingDetailForm.controls['meeting_location'].patchValue(this.currentOrder.meetings[this.currentOrder.meetings.length - 1].location.address);
    if(this.currentOrder.meetings[this.currentOrder.meetings.length - 1].additional_address){
      this.meetingDetailForm.controls['additional_address'].patchValue(this.currentOrder.meetings[this.currentOrder.meetings.length - 1].additional_address);
    }
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }


  // ngOnChanges(): void {
  //   console.log('this.order changes', this.currentOrder);
  // }

  setMeetingTime(event: any){
    this.meetingDetailForm.controls['meeting_time'].patchValue(event.target.value);
  }


  ngAfterViewInit(): void {
    if(this.currentOrder.seller.type.indexOf('seller')> -1){
      this.__setMeetingLocation();
      this.__setOptionalAddress();
    }
  }

  private __setMeetingLocation() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.meetingLocation?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.fillInAddress(autocomplete.getPlace(), true);
      });
    });
  }

  public __setOptionalAddress() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.optionalAddress?.nativeElement, {
      componentRestrictions: { country: ["ec"]  },
      fields: ["address_components"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.fillInAddress(autocomplete.getPlace(), false);
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
                this.parish = parish;
              }
              break;
            case "sublocality":
              parish = component.long_name;
              if (isAddress) {
                this.parish = parish;
              }
              break;
            case "locality":
              city = component.long_name;
              if (isAddress) {
                this.city = city;
              }
              break;
            case "administrative_area_level_1":
              // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
              province = component.long_name;
              if (isAddress) {
                this.province = province;
              }
              break;
            case "administrative_area_level_2":
              province = component.long_name;
              if (isAddress) {
                this.province = province;
              }
              break;
            case "political":
              province = component.long_name;
              if (isAddress) {
                this.province = province;
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
      isAddress ? this.meetingDetailForm.controls['meeting_location'].patchValue(address1) : this.meetingDetailForm.controls['additional_address'].patchValue(address1);
    } catch (ex) {
    }
  }

  public saveMeetingTime(){
    this.isSubmitted = true;
    if(this.meetingDetailForm.invalid){
      return;
    }
    this.scheduleMeetingData.order_id = this.currentOrder.order_id;
    this.scheduleMeetingData.is_meeting_scheduled = false;
    this.scheduleMeetingData.current_stage = this.orderCurrentStage.SCHEDULE_MEETING;
    this.scheduleMeetingData.date = this.meetingDetailForm.controls['meeting_date'].value;
    this.scheduleMeetingData.time = this.meetingDetailForm.controls['meeting_time'].value;
    this.scheduleMeetingData.location.address = this.meetingDetailForm.controls['meeting_location'].value;
    if(this.parish){
      this.scheduleMeetingData.location.parish = this.parish;
    }
    if(this.city){
      this.scheduleMeetingData.location.city = this.city;
    }
    if(this.province){
      this.scheduleMeetingData.location.province = this.province;
    }
    const additionalAddress = this.meetingDetailForm.controls['additional_address'].value;
    if(additionalAddress && additionalAddress.trim() != ''){
      this.scheduleMeetingData.additional_address = additionalAddress;
    }
    // this.currentOrder.meetings = [];
    // this.currentOrder.meetings.push(this.scheduleMeetingData);
    // this.setNextStep();
    this.loading = true;
    this.buyerOrdersService.scheduleMeeting(this.scheduleMeetingData).subscribe({
      next: () => {
        this.loading = false;
        this.scheduleMeetingData.is_meeting_scheduled = true;
        this.scheduleMeetingData.is_accepted = null;
        this.currentOrder.meetings = [];
        this.currentOrder.meetings.push(this.scheduleMeetingData);
        this.modalRef = this.modalService.open(this.scheduledMeeting, { size: 'md', backdrop: 'static', centered: true });
        // this.setNextStep();
      },
      error: (errorRes:Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }

  public nextStep() {
    this.modalRef.close();
    this.setNextStep();
  }

  setNextStep(): void {
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: this.currentStep + 1 });
  }

  setPreviousStep(){
    //this.scheduleMeetingData.current_stage = this.orderCurrentStage.SCHEDULE_MEETING;
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: this.currentStep - 1 });
  }

  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }
}
