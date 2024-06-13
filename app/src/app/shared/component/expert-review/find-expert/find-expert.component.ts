import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaginationData } from 'src/app/modules/admin/admin-vehicles/models/vehicle.model';
import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { Error } from 'src/app/shared/models/error.model';
import { ExpertReviewService } from '../expert-review.service';
import { ExpertList } from '../expert-review.model';
import { ExpertReviewStepsNumber } from 'src/app/shared/constant/add-order-constants';
import { TitleCasePipe } from '@angular/common';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';

@Component({
  selector: 'app-find-expert',
  templateUrl: './find-expert.component.html',
  styleUrls: ['./find-expert.component.scss'],
  providers: [TitleCasePipe]
})

export class FindExpertComponent implements OnInit, AfterViewInit {

  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();

  locationForm: FormGroup;
  @Input() currentExpertReviewStep: number;
  @Input() currentExpertReview: any;
  @Output() onSubmitExpertReviewDetails: EventEmitter<{ orderDetail: Order, nextStep: number, expertReviewDetail: any }> = new EventEmitter();
  @Input() currentOrder: Order;  //loading variable
  loading: boolean = false;
  sortingOrder: boolean = true;
  sortBy: string = 'id';
  order: string = 'DESC';
  allFilterParams: any = {};
  expertList: Array<ExpertList>;
  @Input() expertReviewId: string;
  latitude:any;
  longitude:any;
  locationControls: any;

  @ViewChild('additionalAddress') additionalAddress: any;
  @ViewChild('otherAddress') otherAddress: any;
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  provinceList: string[] = [];
  parishList: string[] = [];
  cityList: string[] = [];
  searchApplied: boolean = false;

  constructor(private ngZone: NgZone, private _fb: FormBuilder, private titleCase: TitleCasePipe,
    private expertEvaluationService: ExpertReviewService, private addVehicleService: AddVehicleService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if (window.innerWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 15;
    }
    this.getAllExperts({ page: 1, limit: this.limit, sortOrder: this.order });
    this.locationFormControls();
  }


  //set google api's after view init
  ngAfterViewInit(): void {
    //this.__getGoogleAddress();
    this.getProvinceList();
  }

  getProvinceList(){
    this.addVehicleService.getProvinceList()
      .subscribe((res: any) => {
        if (res.data?.length > 0) {
          this.provinceList = res.data;
        }
      }, () => {
      })
  }

  setProvince(province: string) {
    this.locationControls['province'].setValue(province);
    this.searchProvince = '';
    this.parishList = [];
    this.locationControls['city'].setValue('');
    this.locationControls['parish'].setValue('');
    this.addVehicleService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.locationControls['city'].setValue(city);
    this.locationControls['parish'].setValue('');
    this.searchCity = '';
    this.addVehicleService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.locationControls['parish'].setValue(parish);
    this.searchParish = '';
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = page;
    this.getAllExperts(this.allFilterParams);
  }

  searchExperts(searchValue: any, typeOfAddress: any) {
    this.searchApplied = true;
    if (searchValue) {
      const search = searchValue.replace(/\s/g, "")
      this.allFilterParams[typeOfAddress] = this.titleCase.transform(searchValue);
      setTimeout(() => {
        this.getAllExperts(this.allFilterParams)
      }, 1000);
    } else {
      delete this.allFilterParams[typeOfAddress]
      this.getAllExperts(this.allFilterParams)
    }
  }

  resetSearch(){
    this.searchApplied = false;
    this.allFilterParams = {};
    this.locationControls['additional_address'].setValue(null);
    this.locationControls['other_address'].setValue(null);
    this.locationControls['province'].setValue(null);
    this.locationControls['city'].setValue(null);
    this.locationControls['parish'].setValue(null);
    this.getAllExperts({ page: 1, limit: this.limit, sortOrder: this.order});
  }


  locationFormControls() {
    this.locationForm = this._fb.group({
      additional_address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      other_address: [],
      parish: ['', Validators.required],
    })
    this.locationControls = this.locationForm.controls;
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = this.sortBy != sortingBy ? this.sortingOrder : !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.allFilterParams.sortBy = this.sortBy;
    this.allFilterParams.sortOrder = this.order
    this.getAllExperts(this.allFilterParams)
  }

  setNextStep(id: string) {
    const expertDetails = {
      expert_review_id: this.currentExpertReview.expert_review_id,
      expert_id: id
    }
    this.expertEvaluationService.postExpertDetails(expertDetails).subscribe({
      next: (resp: any) => {
        this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.CONTACT_INFORMATION, expertReviewDetail: this.currentExpertReview })
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      }
    })
  }

  private __getGoogleAddress() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.additionalAddress?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlace();
        this.latitude = place.geometry['location'].lat();
        this.longitude = place.geometry['location'].lng();
        this.fillInAddress(place, true);
      });
    });
  }

  previous() {
    this.onSubmitExpertReviewDetails.emit({ orderDetail: this.currentOrder, nextStep: ExpertReviewStepsNumber.PRODUCT_SERVICES, expertReviewDetail: this.currentExpertReview })
  }

  searchByKeyword(event){
    if(event.target.value){
      this.allFilterParams['search'] = event.target.value;
      this.allFilterParams['page'] = 1;
      this.allFilterParams['limit'] = this.limit;
      this.allFilterParams['sortOrder'] = this.order;
      this.searchApplied = true;
      this.getAllExperts(this.allFilterParams);
    }else{
      delete this.allFilterParams['search'];
      this.locationControls['additional_address'].setValue(null);
      this.getAllExperts(this.allFilterParams);
    }
  }

  getAllExperts(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.expertEvaluationService.getExpertsList(params).subscribe({
      next: (res: any) => {
        this.expertList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      }
    }
    )
  }

  public fillInAddress(place: any, isAddress: boolean = false) {
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
            this.locationForm.controls['parish'].setValue(parish)
            this.allFilterParams.parish = parish;
            this.searchApplied = true;
            this.getAllExperts(this.allFilterParams)
          }
          break;
        case "sublocality":
          parish = component.long_name;
          if (isAddress) {
            this.locationForm.controls['parish'].setValue(parish)
            this.allFilterParams.parish = parish;
            this.searchApplied = true;
            this.getAllExperts(this.allFilterParams)
          }
          break;
        case "locality":
          city = component.long_name;
          if (isAddress) {
            this.locationForm.controls['city'].setValue(city)
            this.allFilterParams.city = city;
            this.searchApplied = true;
            this.getAllExperts(this.allFilterParams)
            // this.personalInfoFormControls['city'].setValue(city);
          }
          break;
        case "administrative_area_level_1":
          address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
          province = component.long_name;
          if (isAddress) {
            this.locationForm.controls['province'].setValue(province)
            this.allFilterParams.province = province;
            this.searchApplied = true;
            this.getAllExperts(this.allFilterParams)
            // this.personalInfoFormControls['province'].setValue(province);
          }
          break;
        case "administrative_area_level_2":
          province = component.long_name;
          if (isAddress) {
            this.locationForm.controls['province'].setValue(province)
            this.allFilterParams.province = province;
            this.searchApplied = true;
            this.getAllExperts(this.allFilterParams)
            // this.personalInfoFormControls['province'].setValue(province);
          }
          break;
        case "political":
          province = component.long_name;
          if (isAddress) {
            this.locationForm.controls['province'].setValue(province)
            this.allFilterParams.province = province;
            this.searchApplied = true;
            this.getAllExperts(this.allFilterParams)
            // this.personalInfoFormControls['province'].setValue(province);
          }
          break;
        case "country":
          if (isAddress) {
            country = component.long_name;
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
    // isAddress ? this.personalInfoForm.controls['additional_address'].setValue(address1) : this.personalInfoForm.controls['other_address'].setValue(address1);
  }
  triggerSearch() {
    const Event = {
      target: {
        value: this.locationControls['additional_address'].value
      }
    };
    this.searchByKeyword(Event);
  }
  
}
