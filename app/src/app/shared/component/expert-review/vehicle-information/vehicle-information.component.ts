import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { AddVehicleService } from '../../../services/add-vehicle.service';
import { ExpertReviewService } from '../expert-review.service';

import { ArrayHelper } from 'src/app/shared/helpers/array-helper';

import { GetAPIResponse } from 'src/app/shared/models/post-api-response.model';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { ExpertReviewDetails } from '../expert-review.model';
import { ExpertReviewSteps, ExpertReviewStepsNumber, VehicleProcedureStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { AddVehicleConstants } from 'src/app/shared/constant/add-vehicle-constants';
import { Error } from 'src/app/shared/models/error.model';



@Component({
  selector: 'app-vehicle-information',
  templateUrl: './vehicle-information.component.html',
  styleUrls: ['./vehicle-information.component.scss']
})

export class VehicleInformationComponent implements OnInit {

  @Input() currentExpertReview: ExpertReviewDetails;
  @Input() currentExpertReviewStep: number;
  @Input() currentOrder: Order;
  @Output() onSubmitExpertReviewDetails: EventEmitter<{ orderDetail: Order, nextStep: number, expertReviewDetail: any }> = new EventEmitter();
  makeId: any;
  typeId: any;
  selectedDuration: any;
  make: string;
  sendDuration: any;
  selectDuration: any[] = [{ value: '1', option: '1 month' }, { value: '2', option: '2 month' }, { value: '3', option: '3 month' }, { value: '4', option: '4 month' }, { value: '5', option: '5 month' }, { value: '6', option: '6 month' }, { value: '7', option: '7 month' }, { value: '8', option: '8 month' }]
  modelId: any;
  vehicleTypes: any[] = [];
  vehicleMakes: any[] = [];
  popularMakes: any[] = [];
  nonPopularMakes: any[] = [];
  vehicleMakeYears: any[] = [];
  vehicleModels: any[] = [];
  selectedVehicleSource: string = '';
  selectedVehicleType: string = '';
  selectedVehicleMake: string = '';
  selectedVehicleMakeYear: string = '';
  selectedVehicleModel: string = '';
  selectedColor: string = '';
  numberPlate: string = '';
  loading: boolean = false;
  outsideColor: Array<string> = AddVehicleConstants.outsideColor;
  vehicleDetails: any;
  isVehicleFetched: boolean = false;
  classList: string[] = [
   "Automóvil", "Bus", "Pesado", "Maquinaria"
  ];
  selectedClass: string[] = [];
  selectedServices: string[] = [];
  formSubmitted: boolean = false;
  readOnly: boolean = false;
  apiCalling: boolean = false;
  checkedValue: string;
  searchMake: string;
  searchModel: string;
  searchYear: string;
  constructor(private addVehicleService: AddVehicleService, private toastr: ToastrService,
    private expertReviewService: ExpertReviewService, private _fb: FormBuilder,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.setVehicleInformation();
    this.getVehicleMake();
  }

  setVehicleInformation() {

    const currentStep: any =  this.currentExpertReview.current_step;
    let currentStepNumber: any = this.reviewStepNumber[currentStep]
    if(currentStepNumber > ExpertReviewStepsNumber.PAYMENT){
      this.readOnly = true;
    }
    if (this.currentExpertReview.vehicle_information?.number_plate) {
      this.selectedVehicleSource = !this.currentExpertReview.vehicle_information.is_insider ? 'Vehicle off the platform' : 'Vehicle within the platform';
      this.numberPlate = this.currentExpertReview.vehicle_information.number_plate.trim();
      if (this.currentExpertReview.vehicle_information.is_insider) {
        this.getVehicleDetail();
      } else {
        this.vehicleDetails = null;
        this.isVehicleFetched = true;
        this.selectedVehicleMake = this.currentExpertReview.vehicle_information.make;
        this.selectedVehicleMakeYear = this.currentExpertReview.vehicle_information.year;
        this.selectedVehicleModel = this.currentExpertReview.vehicle_information.model;
        this.selectedColor = this.currentExpertReview.vehicle_information.color;
        if (this.currentExpertReview.vehicle_information.class) this.selectedClass = this.currentExpertReview.vehicle_information.class.split(',');
        if (this.currentExpertReview.vehicle_information.services) this.selectedServices = this.currentExpertReview.vehicle_information.services;
      }
    }
  }

  public getVehicleMake() {
    this.vehicleMakeYears = [];
    this.vehicleModels = [];
    let url_param = {};
    this.addVehicleService.getMake(url_param).subscribe((res: any) => {
      this.vehicleMakes = res.data;
      this.popularMakes = ArrayHelper.getArrayChunks(res.data.filter((x: any) => x.is_popular), 4);
      this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  public getVehicleMakeYear(make_id: any) {
    this.vehicleModels = [];
    if (this.makeId != make_id) {
      this.selectedVehicleMakeYear = '';
    }
    this.searchMake = '';
    this.addVehicleService.getMakeYears(make_id).subscribe((res: any) => {
      this.makeId = make_id;
      this.vehicleMakeYears = res.data.years;
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  public getVehicleModel(year: any) {
    this.selectedVehicleModel = '';
    if (this.selectedVehicleMakeYear != year) {
      this.selectedVehicleModel = '';
    }
    this.searchYear = '';
    this.addVehicleService.getModels(this.makeId, year).subscribe((res: any) => {
      this.vehicleModels = res.data;
    },
      (error: any) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  public setVehicleModel(modelId: string) {
    this.modelId = modelId;
    this.searchModel = '';
  }

  public searchInput(event: any, filterKey: string) {
    if (filterKey == 'makes') {
      if (event.target.value != '') {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
      }
    } else if (filterKey == 'year') {
      if (event.target.value != '') {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular), 4);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
      }
    }
  }

  resetMakes() {
    this.popularMakes = ArrayHelper.getArrayChunks(this.vehicleMakes.filter((x: any) => x.is_popular), 4);
    this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
  }

  public formatNumberPlate(event: any) {
    if (event.target.value.length >= 4) {
      const numberPlate = event.target.value
        ? (
          event.target.value.slice(0, 3) +
          '-' +
          event.target.value.slice(4)
        ).toUpperCase()
        : '';
      this.numberPlate = numberPlate;
    } else if (event.target.value) {
      this.numberPlate = event.target.value;
    }
  }

  public getVehicleDetail() {
    if (this.numberPlate && this.numberPlate.trim().length > 7 && this.checkedValue != this.numberPlate.trim()) {
      if (this.readOnly) return;
      this.isVehicleFetched = false;
      if (!this.apiCalling) {
        this.apiCalling = true;
        this.checkedValue = this.numberPlate.trim();
        this.expertReviewService.getVehicleByNumberPlate(this.numberPlate.trim()).subscribe({
          next: (res: GetAPIResponse) => {
            this.isVehicleFetched = true;
            this.apiCalling = false;
            if (res.data) {
              this.vehicleDetails = res.data;
              this.selectedVehicleMake = this.vehicleDetails.make;
              this.selectedVehicleModel = this.vehicleDetails.model;
              this.selectedVehicleMakeYear = this.vehicleDetails.year;
              this.selectedColor = this.vehicleDetails.color;
              this.selectedVehicleSource = 'Jakay Insider';
            }
          },
          error: (errorRes: Error) => {
            this.isVehicleFetched = true;
            this.apiCalling = false;
            this.vehicleDetails = null;
            this.selectedVehicleMake = '';
            this.selectedVehicleModel = '';
            this.selectedVehicleMakeYear = '';
            this.selectedColor = '';
            this.selectedVehicleSource = 'Outsider';
            this.toastr.info(this.translate.instant('No vehicle available on Riku with this number, please enter other details.'));
          }
        });
      }
    }
  }

  public submitVehicleDetails() {
    this.formSubmitted = true;
    if (this.selectedVehicleMake.trim() == '' || this.selectedVehicleModel.trim() == '' ||
      this.selectedVehicleMakeYear == '' || this.numberPlate.trim() == '' || this.selectedVehicleSource.trim() == '') {
      return;
    }

    if (!/^[A-Z, a-z]{1,3}-[0-9]{1,4}$/.test(this.numberPlate)) {
      this.toastr.warning(this.translate.instant('Please enter valid vehicle number plate'));
      return;
    }

    const data: any = {
      "expert_review_id": this.currentExpertReview.expert_review_id,
      "make": this.selectedVehicleMake.trim(),
      "model": this.selectedVehicleModel.trim(),
      "year": this.selectedVehicleMakeYear,
      "number_plate": this.numberPlate.trim(),
      "color": this.selectedColor.trim()
    }
    if (this.selectedClass.length > 0) {
      data['class'] = this.selectedClass.toString();
    }
    if (this.selectedServices.length > 0) {
      data['services'] = this.selectedServices;
    }
    this.loading = true;
    this.expertReviewService.addVehicleInformation(data).subscribe({
      next: (res: any) => {
        this.loading = false;
        let vehicleInformation: any;
        vehicleInformation = {
          body_type: this.vehicleDetails ? this.vehicleDetails.body_type : '',
          class: data['class'] ? data['class'] : null,
          images: [],
          services: data['services'] ? data['services'] : [],
          is_insider: this.vehicleDetails ? true : false,
          expert_review_id: this.currentExpertReview.expert_review_id,
          make: this.selectedVehicleMake.trim(),
          model: this.selectedVehicleModel.trim(),
          year: this.selectedVehicleMakeYear,
          number_plate: this.numberPlate.trim(),
          color: this.selectedColor.trim()
        }
        this.currentExpertReview['vehicle_information'] = vehicleInformation;
        this.next();
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
    });
  }

  public selectClass(className: string) {
    this.selectedClass.indexOf(className) < 0 ? this.selectedClass.push(className) : this.selectedClass.splice(this.selectedClass.indexOf(className), 1);
  }

  public previous() {
    this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.CONTACT_INFORMATION, expertReviewDetail: this.currentExpertReview })
  }

  public next() {
    this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.PAYMENT, expertReviewDetail: this.currentExpertReview })
  }

  public get reviewStepsName(): typeof ExpertReviewSteps {
    return ExpertReviewSteps;
  }

  public get reviewStepNumber(): typeof ExpertReviewStepsNumber {
    return ExpertReviewStepsNumber;
  }

}
