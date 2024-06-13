import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { BuyerVehicleService } from '../../buyers/buyer-vehicle.service';
import { TermsConditionsChatCallComponent } from '../../buyers/buyer-vehicle/terms-conditions-chat-call/terms-conditions-chat-call.component';
import { DealerProfileService } from './dealer-profile.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dealer-profile',
  templateUrl: './dealer-profile.component.html',
  styleUrls: ['./dealer-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DealerProfileComponent implements OnInit {


  constructor(private userService:UserService, private activateroute: ActivatedRoute,
    private buyerVehicleService: BuyerVehicleService, private modalService: NgbModal, private location:Location,
    public authService: AuthService, private toastr: ToastrService, private router: Router,
    private dealerProfileService: DealerProfileService, private translate: TranslateService) { }
  dealerId: string;
  dealerDetail: any;
  getScreenWidth: any;
  isLoggedIn: boolean = false;
  saveBoolean: boolean;
  favId: any[] = [];
  favVehicleId: any[] = [];
  page: any = 1;
  limit: any = 12;
  loading: any = true;
  vehicleListData: any;
  next: any = false;
  previous: any = false;
  vehicleDataArray: any;
  vehicleModels: any;
  vehicleModelsClone: any;
  popularMakes: any;
  nonPopularMakes: any;
  makeId: any;
  vehicleTypes: any;
  vehicleMakes: any;
  province: any;
  selectedBody: any;
  selectedMake: any;

  selectedProvince: any;
  selectedType: Array<any> = [];
  selectedModel: Array<any> = [];
  selectedStatus: Array<any> = [];
  selectedMakeId: any;
  selectedTypeId: Array<any> = [];
  selectedModelId: Array<any> = [];
  searchText: any;
  order: any = 'ASC';
  user_province: any;
  searchApplied: boolean = false;
  bodyTypeList: any;
  yearList: any;
  order_by_list: any = [{ name: 'By Price', id: 'price', min: 'ASC', max: 'DESC' },
  { name: 'By Year', id: 'year', min: 'ASC', max: 'DESC' },
  { name: 'By Publishing Time', id: 'published_at', min: 'ASC', max: 'DESC' },
  { name: 'By Distance', id: 'location', min: 'ASC', max: 'DESC' },
  ]
  outsideColor: any = [
    'White', 'Silver', 'Grey', 'Black', 'Blue', 'Red',
    'Green', 'Orange', 'Brown', 'Gold', 'Beige', 'Purple', 'Pink'
  ];
  fuelTypeList: Array<string> = [
    'Diesel', 'Gasoline', 'Electric', 'Hybrid'
  ];
  passengerCapacity: any = [];
  transmissionList: Array<string> = ['Automatic', 'Manual', 'Sequence'];
  passengerdoorList: Array<number> = []
  selectedEngineSizeMin: any;
  selectedEngineSizeMax: any;
  selectedOrderBy: any = 'price';
  selectedyear: any;
  selectedPriceMin: any;
  selectedPriceMax: any;
  // selectedMileageMin: any;
  // selectedMileageMax: any;
  // selectedMilageUnit: any;
  selectedFuelType: Array<any> = [];
  selectedColor: Array<any> = [];
  selectedCondition: any = '';
  selectedBodyId: any;
  selectedPassengerDoor: any;

  selectedPassengerCap: any;
  selectedTransmission: Array<any> = [];
  more_Filter: boolean = false;

  priceSliderForm: FormGroup = new FormGroup({
    priceControl: new FormControl([0, 600000])
  });
  engineSliderForm: FormGroup = new FormGroup({
    engineControl: new FormControl([0, 500])
  });
  // mileageSliderForm: FormGroup = new FormGroup({
  //   mileageControl: new FormControl([0, 60000])
  // });
  priceOptions: Options = {
    floor: 0,
    ceil: 600000,
    step: 10000,
    translate: (value: number, label: LabelType): string => {
      const value1: any = value.toFixed(2)
      switch (label) {
        case LabelType.Low:
          return '$' + Intl.NumberFormat("es", {
            minimumFractionDigits: 2
          }).format(value1);
        case LabelType.High:
          return '$' + Intl.NumberFormat("es", {
            minimumFractionDigits: 2
          }).format(value1);
        default:
          return '$' + Intl.NumberFormat("es", {
            minimumFractionDigits: 2
          }).format(value1);
      }
    }
  };
  engineOptions: Options = {
    floor: 0,
    ceil: 2500,
    step: 100,
    translate: (value: number, label: LabelType): string => {
      const value1: any = value.toFixed(2)
      switch (label) {
        case LabelType.Low:
          return Intl.NumberFormat("es", {
            minimumFractionDigits: 2
          }).format(value1) + '(CC)';
        case LabelType.High:
          return Intl.NumberFormat("es", {
            minimumFractionDigits: 2
          }).format(value1) + '(CC)';
        default:
          return Intl.NumberFormat("es", {
            minimumFractionDigits: 2
          }).format(value1) + '(CC)';
      }
    }
  };
  // mileageOptions: Options = {
  //   floor: 0,
  //   ceil: 100000,
  //   step: 10000,
  //   translate: (value: number, label: LabelType): string => {
  //     switch (label) {
  //       case LabelType.Low:
  //         return value + '(KM)';
  //       case LabelType.High:
  //         return value + '(KM)';
  //       default:
  //         return value + '(KM)';
  //     }
  //   }
  // };


  ngOnInit(): void {
    this.dealerId = this.activateroute.snapshot.paramMap.get('id') || '';
    // this.authService.isLoggedIn.subscribe((res: any) => {
    //   this.isLoggedIn = res;
    // })
    this.dealerProfileService.getDealerDetails(this.dealerId).subscribe((resp: any) => {
      this.dealerDetail = resp.data;
    })
    this.getFavouriteVehicles()

    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 9;
      this.getAllVehicleList({ page: this.page, limit: this.limit });
    } else {
      this.limit = 12;
      this.getAllVehicleList({ page: this.page, limit: this.limit });
    }

    this.getVehicleTypes();
    this.getBodyType();
    this.getProvince();
    for (let i = 1; i <= 60; i++) {
      if (i < 7) {
        this.passengerdoorList.push(i);
      }
      this.passengerCapacity.push(i);
    }

  }

  getFavouriteVehicles() {
    this.favId = []
    this.favVehicleId = []
    this.dealerProfileService.getFavouriteVehicle().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        for (let i = 0; i < resp.data.length; i++) {
          this.favId.push(resp.data[i].id)
          this.favVehicleId.push(resp.data[i].favourite_vehicle_id)
        }
      }
    })

  }

  openContact(typeOfContact: string, userdetails: any) {
    localStorage.setItem('chatUserId', userdetails.id)
    localStorage.setItem('chatUserEmail', this.dealerDetail.email)
    this.buyerVehicleService.getTermsAndConditionData(typeOfContact.toLowerCase(), userdetails.id).subscribe((resp: any) => {
      const isAccepted = resp.data.is_accepted
      if (isAccepted === false) {
        const modalRef = this.modalService.open(TermsConditionsChatCallComponent, {
          windowClass: 'delete-vehicle-modal modal-lg'
        })
        modalRef.componentInstance.typeOfContact = typeOfContact;
        modalRef.componentInstance.userId = userdetails.id;
        modalRef.componentInstance.userType = 'Dealer';
        modalRef.result.catch((result: any) => {
          if (result === 'proceed') {
            if (typeOfContact === 'Chat') {
              this.router.navigate(['/buyer/chat-user']);
            } else if (typeOfContact === 'Call') {
              this.userService.callingDetails = {};
              this.userService.callingDetails.id = userdetails.id;
              this.userService.callingDetails.type = 'dealer';
              this.userService.callingDetails.mobile_no = userdetails.mobile_no
              this.userService.callingDetails.country_code = userdetails.country_code;
              this.userService.callingDetails.first_name = userdetails.first_name;
              this.userService.callingDetails.last_name = userdetails.last_name;
              this.userService.callingDetails.profile_pic = userdetails.profile_image_url;
              setTimeout(()=>{
                this.router.navigate(['/buyer/call']);
              },300)
            }
          }
        })
      } else {
        if (typeOfContact === 'Chat') {
          this.router.navigate(['/buyer/chat-user']);
        } else if (typeOfContact === 'Call') {
          this.userService.callingDetails = {};
          this.userService.callingDetails.id = userdetails.id;
          this.userService.callingDetails.type = 'dealer';
          this.userService.callingDetails.mobile_no = userdetails.mobile_no
          this.userService.callingDetails.country_code = userdetails.country_code;
          this.userService.callingDetails.first_name = userdetails.first_name;
          this.userService.callingDetails.last_name = userdetails.last_name;
          this.userService.callingDetails.profile_pic = userdetails.profile_image_url;
          setTimeout(()=>{
            this.router.navigate(['/buyer/call']);
          },300)
        }
      }
    })


  }

  getAllVehicleList(param_filter: any): void {
    this.loading = true;
    this.dealerProfileService.getVehicleList(this.dealerId, param_filter).subscribe((res: any) => {
      this.vehicleListData = res.data;
      this.vehicleDataArray = ArrayHelper.getArrayChunks(this.vehicleListData.items, 3)
      if (this.vehicleListData.pagination.total_pages > 1) {
        this.next = true;
      }
      this.loading = false;
    },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.getAllVehicleList({ page: this.page, limit: this.limit });
  }

  // paginationForwardPrevious(next: any, pre: any) {
  //   if (next && this.page < this.vehicleListData.pagination.total_pages) {
  //     this.next = true;
  //     this.previous = false;
  //     this.page++;
  //     this.getAllVehicleList({ page: this.page, limit: this.limit });
  //   }
  //   if (pre && this.page > 1) {
  //     this.next = false;
  //     this.previous = true;
  //     this.page--;
  //     this.getAllVehicleList({ page: this.page, limit: this.limit });
  //   }
  // }

  getFilterVehicleList(order?: any, provience?: any, user_province?: any, more_filter?: any) {
    this.more_Filter = more_filter;
    if (this.priceSliderForm.value) {
      this.selectedPriceMax = this.priceSliderForm.value.priceControl[1];
      this.selectedPriceMin = this.priceSliderForm.value.priceControl[0];
    }
    if (this.engineSliderForm.value && more_filter) {
      this.selectedEngineSizeMax = this.engineSliderForm.value.engineControl[1];
      this.selectedEngineSizeMin = this.engineSliderForm.value.engineControl[0];
    }
    // if (this.mileageSliderForm.value && more_filter) {
    //   this.selectedMileageMax = this.mileageSliderForm.value.mileageControl[1];
    //   this.selectedMileageMin = this.mileageSliderForm.value.mileageControl[0];
    // }
    if (order) {
      this.order = order.ordersort;
      this.selectedOrderBy = order.orderby;
    }
    if (provience) {
      this.selectedProvince = provience;
    }
    let anyarray: any[] = [];
    let url_param = {
      page: this.page,
      limit: this.limit,
      vehicle_types: this.selectedTypeId,
      body_types: this.selectedBodyId,
      condition: this.selectedCondition,
      makes: this.selectedMakeId,
      models: this.selectedModelId,
      order_by: this.selectedOrderBy,
      years: this.selectedyear,
      price_min: this.selectedPriceMin,
      price_max: this.selectedPriceMax,
      search: this.searchText,
      location: this.selectedProvince,
      order: this.order,
      engine_size_min: '',
      engine_size_max: '',
      transmissions: anyarray,
      passanger_doors: anyarray,
      fuel_types: anyarray,
      colors: anyarray,
      passenger_capacities: anyarray,
      // mileage_min: '',
      // mileage_max: '',
      // mileage_unit: '',
    }
    if (user_province) {
      url_param.location = user_province
    }
    if (more_filter) {
      url_param.engine_size_min = this.selectedEngineSizeMin;
      url_param.engine_size_max = this.selectedEngineSizeMax;
      url_param.transmissions = this.selectedTransmission;
      url_param.passanger_doors = this.selectedPassengerDoor;
      url_param.fuel_types = this.selectedFuelType;
      url_param.colors = this.selectedColor;
      url_param.passenger_capacities = this.selectedPassengerCap;
      // url_param.mileage_min = this.selectedMileageMin;
      // url_param.mileage_max = this.selectedMileageMax;
      // url_param.mileage_unit = this.selectedMilageUnit;
    }
    let url_param_filter = Object.fromEntries(Object.entries(url_param).filter(([key, value]) => value !== "" && value !== null && value !== undefined));
    this.getAllVehicleList(url_param_filter);
    this.searchApplied = true;
  }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
  }



  favVehicle(firstIndex: any, secondIndex: any) {
    if (this.favVehicleId.includes(this.vehicleDataArray[firstIndex][secondIndex].id)) {
      let i = this.favVehicleId.indexOf(this.vehicleDataArray[firstIndex][secondIndex].id)
      this.dealerProfileService.deletFavouriteVehicle(this.favId[i]).subscribe((resp: any) => {
        if (resp.success_code === 'REMOVED_FAVOURITE_VEHICLE') {
          this.favVehicleId.splice(i, 1)
          this.favId.splice(i, 1)
        }
      })

    }
    else {
      this.dealerProfileService.postFavouriteVehicle(this.vehicleDataArray[firstIndex][secondIndex].id).subscribe((resp: any) => {
        this.favVehicleId.push(this.vehicleDataArray[firstIndex][secondIndex].id)
        this.favId.push(resp.data.id)
      })
    }

  }

  public getVehicleTypes() {
    this.dealerProfileService.getVehicleTypes().subscribe((res: any) => {
      this.vehicleTypes = res.data;
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      });

  }

  public getVehicleMake() {
    this.searchApplied = false;
    let url_param;
    if (this.selectedTypeId.length > 0) {
      const lengthType = this.selectedTypeId.length;
      url_param = { vehicleTypeId: this.selectedTypeId[lengthType - 1] };
    }
    this.searchApplied = false;

    this.dealerProfileService.getMake(url_param).subscribe((res: any) => {
      this.vehicleMakes = res.data;
      this.popularMakes = res.data.filter((x: any) => x.is_popular);
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


  public getVehicleModel(makeid: any, makename: any) {
    this.selectedMakeId = makeid;
    this.selectedMake = makename;
    this.searchApplied = false;
    if (this.selectedMakeId) {
      this.dealerProfileService.getModels(makeid).subscribe((res: any) => {
        this.vehicleModels = res.data;
        this.vehicleModelsClone = res.data;
      },
        ({ error, status }) => {
          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        });
    } else {
      this.toastr.warning(this.translate.instant('Please Select Make'));
    }
  }

  public getProvince() {
    this.dealerProfileService.getProvinceList().subscribe((res: any) => {
      this.province = res.data;
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  searchInput(event: any, filterKey: string) {
    if (filterKey == 'makes') {
      if (event.target.value != '') {
        this.popularMakes = this.vehicleMakes.filter((x: any) => x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.popularMakes = this.vehicleMakes.filter((x: any) => x.is_popular);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
      }
    } else if (filterKey == 'model') {
      this.vehicleModels = this.vehicleModelsClone;
      if (event.target.value != '') {
        this.vehicleModels = this.vehicleModels.filter((x: any) => x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.vehicleModels = this.vehicleModelsClone;
      }
    }
  }

  selectValue(value: any, field: string, name: any) {
    this.searchApplied = false;

    if (field == 'type') {


      if (this.selectedTypeId.indexOf(value.target.value) == -1 && value.target.checked == true) {
        this.selectedTypeId.push(value.target.value);
        this.selectedType.push(name);
      } else {
        const index = this.selectedTypeId.indexOf(value.target.value);
        if (index > -1) {
          this.selectedTypeId.splice(index, 1);
          this.selectedType.splice(index, 1);
        }
      }
      //console.log(this.selectedTypeId , this.selectedType ,this.selectedTypeIdCheckekbox)
    }

    if (field == 'model') {

      if (this.selectedModelId.indexOf(value.target.value) == -1 && value.target.checked == true) {
        this.selectedModelId.push(value.target.value);
        this.selectedModel.push(name);
      } else {
        const index = this.selectedModelId.indexOf(value.target.value);
        if (index > -1) {
          this.selectedModelId.splice(index, 1);
          this.selectedModel.splice(index, 1);
        }
      }

    } else if (field == 'bodytype') {
      this.selectedBodyId = value.target.value;
      this.selectedBody = name;
    } else if (field == 'year') {
      this.selectedyear = value.target.value;
    } else if (field == 'passenger_door') {
      this.selectedPassengerDoor = value.target.value;
    } else if (field == 'transmission') {
      if (this.selectedTransmission.indexOf(value.target.value) == -1 && value.target.checked == true) {
        this.selectedTransmission.push(value.target.value);
      } else {
        const index = this.selectedTransmission.indexOf(value.target.value);
        if (index > -1) {
          this.selectedTransmission.splice(index, 1);
        }
      }
    } else if (field == 'fuel_type') {
      if (this.selectedFuelType.indexOf(value.target.value) == -1 && value.target.checked == true) {
        this.selectedFuelType.push(value.target.value);
      }
      else {
        const index = this.selectedFuelType.indexOf(value.target.value);
        if (index > -1) {
          this.selectedFuelType.splice(index, 1);
        }
      }
    } else if (field == 'passanger_cap') {
      this.selectedPassengerCap = value.target.value;
    } else if (field == 'colors') {
      if (this.selectedColor.indexOf(value.target.value) == -1 && value.target.checked == true) {
        this.selectedColor.push(value.target.value);
      }
      else {
        const index = this.selectedColor.indexOf(value.target.value);
        if (index > -1) {
          this.selectedColor.splice(index, 1);

        }
      }
    }
  }

  clearAll() {
    this.selectedMake = null;
    this.selectedType = [];
    this.selectedModel = [];
    this.selectedProvince = null;
    this.selectedStatus = [];
    this.selectedMakeId = null
    this.selectedTypeId = [];
    this.selectedModelId = [];
    this.searchText = null;
    this.selectedEngineSizeMin = null;
    this.selectedEngineSizeMax = null;
    this.selectedOrderBy = null;
    this.selectedyear = null;
    this.selectedPriceMin = null;
    this.selectedPriceMax = null;
    // this.selectedMileageMin = null;
    // this.selectedMileageMax = null;
    // this.selectedMilageUnit = null;
    this.selectedFuelType = [];
    this.selectedColor = [];
    this.selectedCondition = [];
    this.selectedBodyId = null;
    this.selectedPassengerDoor = [];
    this.selectedPassengerCap = [];

    this.page = 1;
    this.getFilterVehicleList();
    this.searchApplied = false;
  }

  getBodyType() {
    this.dealerProfileService.getBodyType(this.selectedTypeId).subscribe((res: any) => {
      //this.bodyTypeList = res.data;
      // let bodyTypeListset = this.bodyTypeList.length / 4
      // let bodyrowArray = [];
      // let bodycolumndata = []
      // let count = 0
      // for (let i = 0; i < bodyTypeListset; i++) {
      //   bodycolumndata = []
      //   for (let j = 0; j < 4; j++) {
      //     count++;
      //     if (this.bodyTypeList[count]) {
      //       bodycolumndata.push(this.bodyTypeList[count]);
      //     }
      //   }
      //   bodyrowArray.push(bodycolumndata)
      // }
      // this.bodyTypeList = bodyrowArray
      this.bodyTypeList = ArrayHelper.getArrayChunks(res.data, 4);
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });
  }

  getYearList() {
    if (this.selectedMakeId) {
      this.dealerProfileService.getYear(this.selectedMakeId).subscribe((res: any) => {
        this.yearList = res.data;
      },
        ({ error, status }) => {
          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        });
    } else {
      this.toastr.warning(this.translate.instant('Please Select Make'));
    }

  }

  removeType(type: string) {
    const typeId = this.vehicleTypes.find((x: any) => x.type == type).id;
    this.selectedTypeId.splice(this.selectedTypeId.indexOf(typeId), 1);
    this.selectedType.splice(this.selectedType.indexOf(type), 1);
    this.selectedMake = null;
    this.selectedMakeId = null;
    this.selectedModelId = [];
    this.selectedModel = [];
    this.getFilterVehicleList();
  }

  removeModel(model: string) {
    const modelId = this.vehicleModels.find((x: any) => x.name == model).id;
    this.selectedModelId.splice(this.selectedModelId.indexOf(modelId), 1);
    this.selectedModel.splice(this.selectedModel.indexOf(model), 1);
    this.getFilterVehicleList();
  }

  goback() {
    this.location.back()
  }

}
