import { Component, OnInit, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from "../../../../shared/modals/delete-confirmation/delete-confirmation.component";
import { BuyerVehicleService } from "../../buyer-vehicle.service";
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { FormControl, FormGroup } from "@angular/forms";
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-buyer-vehicle-list',
  templateUrl: './buyer-vehicle-list.component.html',
  styleUrls: ['./buyer-vehicle-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BuyerVehicleListComponent implements OnInit, OnDestroy {
  user: any;
  vehicleListData: any;
  showHeart: boolean[] = [];
  loading: any = true;
  page: any = 1;
  limit: any;
  next: any = false;
  previous: any = false;
  getScreenWidth: any;
  deletedVehicleId: string;
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
  searchModel:any;
  searchMake:any;

  selectedProvince: any = null;
  selectedType: Array<any> = [];
  selectedModel: Array<any> = [];
  selectedStatus: Array<any> = [];
  selectedMakeId: any;
  selectedTypeId: Array<any> = [];
  selectedModelId: Array<any> = [];
  searchText: any = null;
  order: any = 'ASC';
  user_province: any;
  searchApplied: boolean = true;
  bodyTypeList: any;
  yearList: any;
  applyPriceFilter: boolean = true;

  order_by_list: any = [{ name: 'By Price', id: 'price', min: 'ASC', max: 'DESC', options: ['Low To High', 'High to Low'] },
  { name: 'By Year', id: 'year', min: 'ASC', max: 'DESC', options: ['Old to New', 'New to Old'] },
  { name: 'By Publishing Time', id: 'published_at', min: 'ASC', max: 'DESC', options: ['Old to New', 'New to Old'] },
  { name: 'By Distance', id: 'location', min: 'ASC', max: 'DESC', options: ['Near to Far', 'Far to Near'] },
  ]
  outsideColor: any = [
    'White', 'Silver', 'Grey', 'Black', 'Blue', 'Red',
    'Green', 'Gold', 'Beige', 'Purple', 'Pink', 'Yellow', 'Orange', 'Brown',
  ];
  fuelTypeList: Array<string> = [
    'Diesel', 'Gasoline', 'Electric', 'Hybrid'
  ];
  passengerCapacity: any = [];
  transmissionList: Array<string> = ['Automatic', 'Manual', 'Sequence',
  'Continuously variable', 'Geared', 'Double clutch', 'Hydrostatic / Continuous'];
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
  favId: any[] = [];
  favVehicleId: any[] = [];
  vehicleProvinceClone: any;
  searchValue: string | null;
  more_Filter: boolean = false;
  priceSliderForm: FormGroup = new FormGroup({
    priceControl: new FormControl([0, 10000000])
  });
  engineSliderForm: FormGroup = new FormGroup({
    engineControl: new FormControl([0, 500])
  });
  // mileageSliderForm: FormGroup = new FormGroup({
  //   mileageControl: new FormControl([0, 60000])
  // });
  priceOptions: Options = {
    floor: 0,
    ceil: 350000,
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
    ceil: 6000,
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
  //         return Intl.NumberFormat("es").format(value) + '(KM)';
  //       case LabelType.High:
  //         return Intl.NumberFormat("es").format(value) + '(KM)';
  //       default:
  //         return Intl.NumberFormat("es").format(value) + '(KM)';
  //     }
  //   }
  // };

  vehiclesLoading: boolean = false;
  isSignedin: boolean = false;

  constructor(private buyervehicleService: BuyerVehicleService, public router: Router,
    private toastr: ToastrService, private translate: TranslateService, private authService: AuthService,
    private modalService: NgbModal) {
  }

  async ngOnInit() {
    localStorage.removeItem('current_order_id');
    this.getScreenWidth = window.innerWidth;
    // this.user = localStorage.getItem('username');
    if (this.getScreenWidth < 768) {
      this.limit = 8;
    } else {
      this.limit = 15;
    }
    this.isSignedin = this.authService.isSignedin();
    if(this.isSignedin){
      this.getFavouriteVehicle();
    }
    if (JSON.parse(localStorage.getItem('searchData')!)) {
      this.getAllVehicleList(JSON.parse(localStorage.getItem('searchData')!))
    } else if (localStorage.getItem('max_vehicle_price')) {
      this.getAllVehicleList({
        price_min: 0,
        page: 1,
        limit: this.limit,
        price_max: localStorage.getItem('max_vehicle_price'),
        order: this.order
      })
      localStorage.removeItem('max_vehicle_price');
    } else {
      await this.findMe();
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


  getFavouriteVehicle() {
    this.favId = []
    this.favVehicleId = []
    this.buyervehicleService.getFavouriteVehicle().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        for (let i = 0; i < resp.data.length; i++) {
          this.favId.push(resp.data[i].id)
          this.favVehicleId.push(resp.data[i].favourite_vehicle_id)
        }
      }
    })
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

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
  }

  getAllVehicleList(param_filter: any): void {
    this.vehiclesLoading = true;
    this.buyervehicleService.getAllVehicle(param_filter).subscribe((res: any) => {
      this.vehicleListData = res.data;
      if (localStorage.getItem('searchData')) {
        localStorage.removeItem('searchData')
      }
      if (this.vehicleListData.pagination.total_pages > 1) {
        this.next = true;
      }
      this.vehiclesLoading = false;
    },
      ({ error }) => {
        this.vehiclesLoading = false;
        if (localStorage.getItem('searchData')) {
          localStorage.removeItem('searchData')
        }
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  setPriceFilter() {
    this.applyPriceFilter = true;
    this.getFilterVehicleList()
  }

  searchVehicle() {
    if (!this.searchText || this.searchText.trim() == '') {
      this.toastr.error(this.translate.instant('Please enter search keyword first!!'));
      return;
    }
    this.searchValue = this.searchText;
    this.resetAllFilter();
    this.searchApplied = true;
    this.searchText = this.searchValue;
    this.getAllVehicleList({
      search: this.searchValue,
      page: 1,
      limit: this.limit,
      order: this.order ? this.order : 'ASC'
    })

  }

  getFilterVehicleList(order?: any, provience?: any, user_province?: any, more_filter?: any) {
    this.more_Filter = more_filter ? more_filter : false;
    if (this.priceSliderForm.value && this.applyPriceFilter) {
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
    // if (this.selectedTypeId.length == 0) {
    //   this.searchApplied = false;
    // } else {
    //   this.searchApplied = true;
    // }
    if (this.selectedMake != null ||
      this.selectedType.length != 0 ||
      this.selectedProvince != null ||
      this.selectedMakeId != null ||
      this.selectedTypeId.length != 0 ||
      this.selectedModelId.length != 0 ||
      this.selectedModel.length != 0 ||
      this.more_Filter != false ||
      this.searchText != null || this.selectedOrderBy != null)  {
      this.searchApplied = true;
    } else {
      this.searchApplied = false
    }
  }

  favVehicle(index: any) {
    if (this.favVehicleId.includes(this.vehicleListData.items[index].id)) {
      let i = this.favVehicleId.indexOf(this.vehicleListData.items[index].id)
      this.buyervehicleService.deletFavouriteVehicle(this.favId[i]).subscribe((resp: any) => {
        if (resp.success_code === 'REMOVED_FAVOURITE_VEHICLE') {
          this.favVehicleId.splice(i, 1)
          this.favId.splice(i, 1)
        }
      })
    }
    else {
      this.buyervehicleService.postFavouriteVehicle(this.vehicleListData.items[index].id).subscribe((resp: any) => {
        this.favVehicleId.push(this.vehicleListData.items[index].id)
        this.favId.push(resp.data.id)
      })
    }

  }

  openDeleteConfirmation(vehicleId: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal '
    })
    this.deletedVehicleId = vehicleId;
    modalRef.componentInstance.vehicleId = vehicleId;

  }

  public getVehicleTypes() {
    this.buyervehicleService.getVehicleTypes().subscribe((res: any) => {
      this.vehicleTypes = res.data;
      this.selectedTypeId = res.data.map((typeVehicle: any) => typeVehicle.id);
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });

  }

  public getVehicleMake() {
    if (this.selectedTypeId.length == 0) {
      this.toastr.warning(this.translate.instant('Please First Select Vehicle Type'));
      this.popularMakes = []
      this.vehicleMakes = [];
      this.nonPopularMakes = [];
      this.vehicleModels = [];
      this.vehicleModelsClone = [];
      this.yearList = [];
      return;
    }
    let url_param;
    if (this.selectedTypeId.length > 0) {
      const lengthType = this.selectedTypeId.length;
      url_param = { vehicleTypeId: this.selectedTypeId };
    }
    this.buyervehicleService.getMake(url_param).subscribe((res: any) => {
      this.vehicleMakes = res.data;
      const popularMakes = res.data.filter((x: any) => x.is_popular);
      this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
      this.popularMakes = ArrayHelper.getArrayChunks(popularMakes, 4);
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      });

  }


  public getVehicleModel(getMakeValue: any, makeid?: any, makename?: any) {
    if (getMakeValue == 'false') {
      if (this.selectedMake == null) {
        this.toastr.warning(this.translate.instant('Please First Select Make'));
        return;
      }
    } else if (getMakeValue == 'true') {
      this.selectedMakeId = makeid;
      this.selectedMake = makename;
      this.searchApplied = false;
      if (this.selectedMakeId) {
        this.buyervehicleService.getModels(makeid).subscribe((res: any) => {
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
        this.toastr.warning(this.translate.instant('Please First Select Make'));
      }
    }


  }

  public getProvince() {
    this.buyervehicleService.getProvinceList().subscribe((res: any) => {
      this.province = res.data;
      this.vehicleProvinceClone = res.data;
    },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong Please Try again later');
        }
      });
  }

  searchInput(event: any, filterKey: string) {
    if (filterKey == 'makes') {
      if (event.target.value != '') {
        const popularMakes = this.vehicleMakes.filter((x: any) => x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
        this.popularMakes = ArrayHelper.getArrayChunks(popularMakes, 4);
      } else {
        const popularMakes = this.vehicleMakes.filter((x: any) => x.is_popular);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
        this.popularMakes = ArrayHelper.getArrayChunks(popularMakes, 3);
      }
    } else if (filterKey == 'model') {
      this.vehicleModels = this.vehicleModelsClone;
      if (event.target.value != '') {
        this.vehicleModels = this.vehicleModels.filter((x: any) => x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
      } else {
        this.vehicleModels = this.vehicleModelsClone;
      }
    } else if (filterKey == 'location') {

      this.province = this.vehicleProvinceClone;
      if (event.target.value != '') {
        this.province = this.vehicleProvinceClone.filter((x: any) => x.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);

      } else {
        this.province = this.vehicleProvinceClone;
      }
    }
  }

  selectValue(value: any, field: string, name: any) {
    this.searchApplied = false;
    if (field == 'type') {
      this.selectedModelId = [];
      this.selectedModel = [];
      this.selectedMake = null;
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
      this.selectedyear = name;
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

  resetAllFilter() {
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
    this.selectedPriceMin = 0;
    this.selectedPriceMax = 10000000;
    this.selectedFuelType = [];
    this.selectedColor = [];
    this.selectedCondition = '';
    this.selectedBodyId = null;
    this.selectedPassengerDoor = [];
    this.selectedPassengerCap = [];
    this.page = 1;
    this.searchApplied = false;
    this.applyPriceFilter = false;
    this.priceSliderForm.get('priceControl')?.patchValue([0, 10000000])
  }

  clearAll() {
    this.selectedMake = null;
    this.selectedType = [];
    this.selectedModel = [];
    this.selectedProvince = null;
    this.selectedStatus = [];
    this.selectedMakeId = null;
    this.order = 'ASC';
    this.selectedTypeId = [];
    this.selectedModelId = [];
    this.searchText = null;
    this.selectedEngineSizeMin = null;
    this.selectedEngineSizeMax = null;
    this.selectedOrderBy = null;
    this.selectedyear = null;
    this.selectedPriceMin = 0;
    this.selectedPriceMax = 10000000;
    this.selectedFuelType = [];
    this.selectedColor = [];
    this.selectedCondition = '';
    this.selectedBodyId = null;
    this.selectedPassengerDoor = [];
    this.selectedPassengerCap = [];
    this.popularMakes = []
    this.nonPopularMakes = []
    this.vehicleMakes = []
    this.vehicleModels = []
    this.vehicleModelsClone = []
    this.page = 1;
    this.searchApplied = false;
    this.applyPriceFilter = false;
    this.searchValue = null;
    this.priceSliderForm.get('priceControl')?.patchValue([0, 10000000])
    this.getAllVehicleList({ page: this.page, limit: this.limit });

  }

  getBodyType() {
    this.buyervehicleService.getBodyType(this.selectedTypeId).subscribe((res: any) => {
      this.bodyTypeList = res.data;
      this.bodyTypeList = ArrayHelper.getArrayChunks(this.bodyTypeList, 4);
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
      this.buyervehicleService.getYear(this.selectedMakeId).subscribe((res: any) => {
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
      this.toastr.warning(this.translate.instant('Please First Select Make'));
    }

  }

  findMe() {
    let position: any;
    navigator.permissions.query({ name: 'geolocation' }).then((res: any) => {
      navigator.geolocation.getCurrentPosition((google_position) => {
        position = google_position;
        this.searchApplied = true;
        this.getLocation(position);
      }, (failed) => {
        this.getAllVehicleList({ page: this.page, limit: this.limit });
      });
    });
  }

  getLocation(position: any) {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    let request: any = {
      latLng: latlng,
    };
    geocoder.geocode(request, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0] != null) {
          let user_province = results[0].address_components.filter(ac => ~ac.types.indexOf('administrative_area_level_1'))[0].long_name
          //let address = results[0].formatted_address;
          this.user_province = user_province;
          this.selectedProvince = this.user_province;
          this.loading = false;
          if (this.user_province) {
            this.searchApplied = true;
            this.getAllVehicleList({ page: this.page, limit: this.limit, location: this.user_province });
          }
        }
      }
    });

    /*this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Got you!'
      });
    }
    else {
      this.marker.setPosition(location);
    }*/
  }

  removeType(type: string) {
    const typeId = this.vehicleTypes.find((x: any) => x.type == type).id;
    if (this.selectedTypeId.length > 0) {
      this.selectedTypeId.splice(this.selectedTypeId.indexOf(typeId), 1);
      this.selectedType.splice(this.selectedType.indexOf(type), 1);
      this.getVehicleMake()
      if (this.vehicleMakes.length > 0) {
        setTimeout(() => {
          if (this.vehicleMakes.some((x: any) => x.id == this.selectedMakeId)) {
            this.selectedMakeId = this.selectedMakeId
            this.selectedMake = this.selectedMake
            this.selectedModelId = this.selectedModelId;
            this.selectedModel = this.selectedModel;
            this.selectedyear = this.selectedyear;
          } else {
            this.selectedMakeId = null
            this.selectedMake = null
            this.selectedModelId = [];
            this.selectedModel = [];
            this.selectedyear = null;
            this.vehicleModels = [];
            this.vehicleModelsClone = [];
            this.yearList = [];
          }
        }, 800);
      } else {
        this.selectedMakeId = null
        this.selectedMake = null
        this.selectedModelId = [];
        this.selectedModel = [];
        this.selectedyear = null;
      }
    } else {
      this.selectedMake = null;
      this.selectedMakeId = null;
      this.selectedModelId = [];
      this.selectedModel = [];
      this.selectedyear = null;
      this.popularMakes = []
      this.vehicleMakes = [];
      this.nonPopularMakes = [];
      this.vehicleModels = [];
      this.vehicleModelsClone = [];
      this.yearList = [];
    }
    if (this.selectedType.length == 0) {
      this.searchApplied = false
    }
    this.getFilterVehicleList();
  }

  removeModel(model: string) {
    const modelId = this.vehicleModels.find((x: any) => x.name == model).id;
    this.selectedModelId.splice(this.selectedModelId.indexOf(modelId), 1);
    this.selectedModel.splice(this.selectedModel.indexOf(model), 1);
    this.getFilterVehicleList();

  }

  ngOnDestroy() {
    localStorage.removeItem('current_order_id');
  }
}
