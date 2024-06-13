import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AddVehicleService } from "../../../../shared/services/add-vehicle.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { TranslateService } from '@ngx-translate/core';
import { BuyerVehicleService } from 'src/app/modules/buyers/buyer-vehicle.service';

@Component({
  selector: 'app-seller-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})

export class SellerVehicleListComponent implements OnInit {
  user: any;
  vehicleListData: any;
  loading: boolean = true;
  page: any = 1;
  limit: any;
  next: any = false;
  previous: any = false;
  getScreenWidth: any;
  deletedVehicleId: string;
  role: any = JSON.parse(localStorage.getItem('type') || '')
  typeIsSeller: any;
  vehicleModels: any;
  vehicleModelsClone: any;
  vehicleProvinceClone: any;
  selectedyear: any;
  popularMakes: any;
  nonPopularMakes: any;
  makeId: any;
  vehicleTypes: any;
  vehicleMakes: any;
  province: any;
  selectedMake: any;
  selectedType: Array<any> = [];
  selectedModel: Array<any> = [];
  selectedProvince: any;
  selectedStatus: Array<any> = [];
  selectedMakeId: any;
  selectedTypeId: Array<any> = [];
  selectedModelId: Array<any> = [];
  searchText: any;
  yearList: any;
  order: any = 'ASC';
  user_province: any;
  searchApplied: boolean = false;
  selectedBodyId: any;
  selectedBody: any;
  bodyTypeList: any;

  statusList = [{ id: 'approved', status: 'Approved' },
  { id: 'rejected', status: 'Rejected' },
  { id: 'pending', status: 'Awaiting Approval' },
  { id: 'draft', status: 'Saved as Draft' }]
  searchValue: string | null;


  constructor(private buyervehicleService: BuyerVehicleService, private vehicleService: AddVehicleService, public router: Router, private toastr: ToastrService,
    private modalService: NgbModal, private translate: TranslateService) {
  }

  ngOnInit(): void {

    this.role.forEach((role: any) => {
      if (role == 'seller') {
        this.typeIsSeller = true;
      }
    })
    this.getScreenWidth = window.innerWidth;
    // this.user = localStorage.getItem('username');
    if (this.getScreenWidth < 768) {
      this.limit = 10;
      this.getAllVehicleList({ page: this.page, limit: this.limit, order: this.order });
    } else {
      this.limit = 20;
      this.getAllVehicleList({ page: this.page, limit: this.limit, order: this.order });
    }

    this.vehicleService.getDeleteVehicle.subscribe((isDeleted) => {
      if (isDeleted) {
        const deleteVehicleIndex = this.vehicleListData?.items.findIndex((x: any) => x.id == this.deletedVehicleId);
        if (deleteVehicleIndex > -1) {
          this.vehicleListData.items.splice(deleteVehicleIndex, 1);
        }
      }
    })
    this.getVehicleTypes();
    this.getProvince();
    this.getBodyType();
    // this.findMe();
  }


  jumpToThePage(page: number) {
    this.page = page;
    this.getAllVehicleList({ page: this.page, limit: this.limit, order: this.order });
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
      page:1,
      limit: this.limit,
      order: this.order ? this.order : 'ASC'
    })
  }

  resetAllFilter(){
    this.page = 1;
    this.selectedMake = null
    this.selectedType = [];
    this.selectedModel = [];
    this.selectedProvince = null;
    this.selectedyear = null;
    this.selectedStatus = [];
    this.selectedMakeId = null
    this.selectedTypeId = [];
    this.selectedModelId = [];
    this.searchText = null;
    this.searchApplied = false;
    this.selectedBodyId = null;
  }

  getAllVehicleList(param_filter: any): void {
    this.loading = true;
    this.vehicleService.getAllVehicle(param_filter).subscribe((res: any) => {
      this.vehicleListData = res.data;
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
  getYearList() {
    if (this.selectedMakeId) {
      this.vehicleService.getYear(this.selectedMakeId).subscribe((res: any) => {
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


  getFilterVehicleList(order?: any, provience?: any, user_province?: any) {

    if (order) {
      this.order = order;
    }
    if (provience) {
      this.searchApplied = true;
      this.selectedProvince = provience;
    }
    let url_param = {
      page: this.page,
      limit: this.limit,
      vehicle_types: this.selectedTypeId,
      // body_types: this.selectedBodyId,
      makes: this.selectedMakeId,
      models: this.selectedModelId,
      years: this.selectedyear,
      status: this.selectedStatus,
      search: this.searchText,
      location: this.selectedProvince,
      order: this.order
    }
    if (user_province) {
      url_param = {
        page: this.page,
        limit: this.limit,
        vehicle_types: this.selectedTypeId,
        // body_types: this.selectedBodyId,
        makes: this.selectedMakeId,
        models: this.selectedModelId,
        years: this.selectedyear,
        status: this.selectedStatus,
        search: this.searchText,
        location: this.user_province,
        order: this.order
      }
    }

    let url_param_filter = Object.fromEntries(Object.entries(url_param).filter(([key, value]) => value !== "" && value !== null && value !== undefined));

    this.getAllVehicleList(url_param_filter);
    if (this.selectedMake != null ||
      this.selectedType != null ||
      this.selectedModel != null ||
      this.selectedProvince != null ||
      this.selectedMakeId != null ||
      this.selectedyear != null ||
      this.selectedTypeId.length != 0 ||
      this.selectedModelId.length != 0 ||
      this.searchText != null) {
        this.searchApplied = true;
    }
  }

  openDeleteConfirmation(vehicleId: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal '
    })
    this.deletedVehicleId = vehicleId;
    const modalSuccessButton = this.translate.instant('Back to Vehicle Listing')
    modalRef.componentInstance.vehicleId = vehicleId;

    modalRef.componentInstance.deleteSuccessBtnText = modalSuccessButton

  }

  public getVehicleTypes() {
    this.vehicleService.getVehicleTypes().subscribe((res: any) => {
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
    this.searchApplied = false;
    let url_param;
    if (this.selectedTypeId.length == 0) {
      this.toastr.warning(this.translate.instant('Please Select Vehicle Type.'));
      this.popularMakes = [];
      this.nonPopularMakes = [];
      return;
    }
    if (this.selectedTypeId.length > 0) {
      // const lengthType = this.selectedTypeId.length;
      // url_param = { vehicleTypeId: this.selectedTypeId[lengthType - 1] };
      url_param = { vehicleTypeId: this.selectedTypeId };
    }

    this.vehicleService.getMake(url_param).subscribe((res: any) => {
      this.vehicleMakes = res.data;
      const popularMakes = res.data.filter((x: any) => x.is_popular);
      this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
      this.popularMakes = ArrayHelper.getArrayChunks(popularMakes, 3);
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
    this.vehicleService.getModels(makeid).subscribe((res: any) => {
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
  }

  public getProvince() {
    this.vehicleService.getProvinceList().subscribe((res: any) => {
      this.province = res.data;
      this.vehicleProvinceClone = res.data;
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
        const popularMakes = this.vehicleMakes.filter((x: any) => x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular && x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
        this.popularMakes = ArrayHelper.getArrayChunks(popularMakes, 4);
      } else {
        const popularMakes = this.vehicleMakes.filter((x: any) => x.is_popular);
        this.nonPopularMakes = this.vehicleMakes.filter((x: any) => !x.is_popular);
        this.popularMakes = ArrayHelper.getArrayChunks(popularMakes, 4);
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

  selectValue(value: any, field: string, name?: any) {
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

    } else if (field == 'status') {
      if (this.selectedStatus.indexOf(value.target.value) == -1 && value.target.checked == true) {
        this.selectedStatus.push(value.target.value);
      } else {
        const index = this.selectedStatus.indexOf(value.target.value);
        if (index > -1) {
          this.selectedStatus.splice(index, 1);
        }
      }
    } else if(field == 'year') {
      this.selectedyear = name;
    } else if (field == 'bodytype') {
      this.selectedBodyId = value.target.value;
      this.selectedBody = name;
    }
  }

  removeType(type: string) {
    const typeId = this.vehicleTypes.find((x: any) => x.type == type).id;
    this.selectedTypeId.splice(this.selectedTypeId.indexOf(typeId), 1);
    this.selectedType.splice(this.selectedType.indexOf(type), 1);
  }

  clearAll() {
    this.page = 1;
    this.selectedMake = null
    this.selectedType = [];
    this.selectedModel = [];
    this.selectedProvince = null;
    this.selectedStatus = [];
    this.selectedMakeId = null
    this.selectedTypeId = [];
    this.selectedModelId = [];
    this.searchText = null;
    this.selectedyear = null;
    this.searchApplied = false;
    this.searchValue = null;
    this.getAllVehicleList({page : this.page, limit: this.limit});
    this.selectedBodyId = null;
  }

  // findMe() {
  //   let position: any;
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((Google_position) => {
  //       position = Google_position
  //       this.showPosition(position)
  //     });
  //   } else {
  //     let msg = 'Geolocation is not supported by this browser';
  //   }
  //   navigator.permissions.query({ name: 'geolocation' }).then((res: any) => {
  //     if (res.state == 'prompt') {
  //       this.getFilterVehicleList();
  //     }
  //     if (res.state == 'denied') {
  //       this.getFilterVehicleList();
  //     }
  //   })

  // }


  // showPosition(position: any) {
  //   let geocoder = new google.maps.Geocoder();
  //   let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //   let request: any = {
  //     latLng: latlng,
  //   };
  //   geocoder.geocode(request, (results, status) => {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       if (results[0] != null) {
  //         let user_province = results[0].address_components.filter(ac => ~ac.types.indexOf('administrative_area_level_1'))[0].long_name
  //         //let address = results[0].formatted_address;
  //         this.user_province = user_province;
  //         this.selectedProvince = this.user_province;
  //         this.loading = false;
  //         this.searchApplied = true;
  //         if (this.user_province) {
  //           this.getFilterVehicleList();
  //         }
  //       } else {
  //         alert(this.translate.instant("No address available"));
  //       }
  //     }
  //   });

  //   /*this.map.panTo(location);

  //   if (!this.marker) {
  //     this.marker = new google.maps.Marker({
  //       position: location,
  //       map: this.map,
  //       title: 'Got you!'
  //     });
  //   }
  //   else {
  //     this.marker.setPosition(location);
  //   }*/
  // }
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
}
