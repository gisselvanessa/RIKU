import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';
import { DealerVehiclesService } from '../dealer-vehicles.service';
import { ArrayHelper } from 'src/app/shared/helpers/array-chunks';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dealer-vehicle-list',
  templateUrl: './dealer-vehicle-list.component.html',
  styleUrls: ['./dealer-vehicle-list.component.scss'],
})

export class DealerVehicleListComponent implements OnInit {
  user: any;
  vehicleListData: any;
  loading: any = true;
  page: any = 1;
  limit: any;
  next: any = false;
  previous: any = false;
  getScreenWidth: any;
  deletedVehicleId: string;
  role: any = JSON.parse(localStorage.getItem('type') || '');
  typeIsSeller: any;
  vehicleMakeYears = [];
  vehicleModels: any;
  vehicleModelsClone: any;
  popularMakes: any;
  nonPopularMakes: any;
  makeId: any;
  vehicleTypes: any;
  vehicleMakes: any;
  province: any;
  selectedMake: any;
  selectedType: any;
  selectedModel: any;
  selectedProvince: any;
  selectedStatusId: any = [];
  selectedStatuses: any = [];
  selectedMakeId: any;
  selectedyear: any;
  yearList: any;
  selectedTypeId: any = [];
  selectedTypes: any = [];
  selectedModelId: any = [];
  searchText: any;
  order: any = 'ASC';
  user_province: any;
  searchApplied: boolean = false;
  selectedTab = 'All';
  searchProvince: string;
  selectedModels: any = [];
  statusList = [
    { id: 'approved', status: 'Approved' },
    { id: 'rejected', status: 'Rejected' },
    { id: 'pending', status: 'Awaiting Approval' },
    { id: 'draft', status: 'Saved as Draft' },
  ];
  searchValue: string | null;


  constructor(
    private vehicleService: AddVehicleService,
    private dealerVehiclesService: DealerVehiclesService,
    public router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    this.role.forEach((role: any) => {
      if (role == 'dealer') {
        this.typeIsSeller = true;
      }
    });
    //await this.findMe();
    this.getScreenWidth = window.innerWidth;
    // this.user = localStorage.getItem('username');
    if (this.getScreenWidth < 768) {
      this.limit = 8;
      //this.getAllVehicleList({ page: this.page, limit: this.limit });
      this.selectTab('all');
    } else {
      this.limit = 15;
      //this.getAllVehicleList({ page: this.page, limit: this.limit });
      this.selectTab('all');
    }

    this.vehicleService.getDeleteVehicle.subscribe((isDeleted) => {
      if (isDeleted) {
        const deleteVehicleIndex = this.vehicleListData?.items.findIndex(
          (x: any) => x.id == this.deletedVehicleId
        );
        if (deleteVehicleIndex > -1) {
          this.vehicleListData.items.splice(deleteVehicleIndex, 1);
        }
      }
    });
    this.getVehicleTypes();
    this.getProvince();
  }

  // paginationForwardPrevious(next: any, pre: any) {
  //   let loc;
  //   if (this.user_province) {
  //     loc = this.user_province;
  //   } else {
  //     if (this.selectedProvince) {
  //       loc = this.selectedProvince;
  //     }
  //   }
  //   if (next && this.page < this.vehicleListData.pagination.total_pages) {
  //     this.next = true;
  //     this.previous = false;
  //     this.page++;
  //     if (loc) {
  //       this.getAllVehicleList({
  //         page: this.page,
  //         limit: this.limit,
  //         order: this.order,
  //         location: loc,
  //       });
  //     } else {
  //       this.getAllVehicleList({
  //         page: this.page,
  //         limit: this.limit,
  //         order: this.order
  //       });
  //     }
  //   }
  //   if (pre && this.page > 1) {
  //     this.next = false;
  //     this.previous = true;
  //     this.page--;
  //     if (loc) {
  //       this.getAllVehicleList({
  //         page: this.page,
  //         limit: this.limit,
  //         order: this.order,
  //         location: loc,
  //       });
  //     } else {
  //       this.getAllVehicleList({
  //         page: this.page,
  //         limit: this.limit,
  //         order: this.order
  //       });
  //     }

  //   }
  // }


  jumpToThePage(page:number){
    this.page = page;
    let loc;
    if (this.user_province) {
      loc = this.user_province;
    } else {
      if (this.selectedProvince) {
        loc = this.selectedProvince;
      }
    }
    if (loc) {
      this.getAllVehicleList({
        page: this.page,
        limit: this.limit,
        order: this.order,
        location: loc,
      });
    } else {
      this.getAllVehicleList({
        page: this.page,
        limit: this.limit,
        order: this.order
      });
    }
  }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src =
      'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
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
    this.selectedMake = null;
    this.selectedType = null;
    this.selectedModel = null;
    this.selectedProvince = undefined;
    this.selectedStatusId = [];
    this.selectedStatuses = [];
    this.selectedMakeId = null;
    this.selectedTypeId = [];
    this.selectedModelId = [];
    this.selectedModels = [];
    this.selectedyear=null;
    this.searchText = null;
    this.searchApplied = false;
    this.selectedTypes = [];
    this.searchApplied = false;
  }

  getAllVehicleList(param_filter: any): void {
    this.loading = true;
    this.dealerVehiclesService.getAllVehicle(param_filter).subscribe(
      (res: any) => {
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
          this.toastr.error(this.translate.instant('Image size must be smaller than 5 MB'));
        }
      }
    );
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
      this.selectedProvince = provience;
    }

    let url_param: any = {
      page: this.page,
      limit: this.limit,
      order: this.order,
    };

    if (this.selectedTab && this.selectedTab != 'all') {
      url_param['condition'] = this.selectedTab;
    }
    if (this.searchText) {
      url_param['search'] = this.searchText;
    }
    if (this.selectedStatusId.length > 0) {
      url_param['status'] = this.selectedStatusId;
    }
    if (this.selectedMakeId) {
      url_param['makes'] = this.selectedMakeId;
    }
    if (this.selectedModelId.length > 0) {
      url_param['models'] = this.selectedModelId;
    }
    if(this.selectedyear){
      url_param['years']= this.selectedyear
    }
    if (this.selectedTypeId.length > 0) {
      url_param['vehicle_types'] = this.selectedTypeId;
    }
    if (user_province) {
      url_param['location'] = this.user_province;
    } else {
      if (this.selectedProvince) {
        url_param['location'] = this.selectedProvince;
      }
    }

    // let url_param_filter = Object.fromEntries(
    //   Object.entries(url_param).filter(
    //     ([key, value]) => value !== '' && value !== null && value !== undefined
    //   )
    // );
    this.getAllVehicleList(url_param);

    if(this.selectedMake != null ||
      this.selectedType != null ||
      this.selectedModel != null ||
      this.selectedProvince != null ||
      this.selectedStatusId.length != 0 ||
      this.selectedStatuses.length != 0||
      this.selectedMakeId != null ||
      this.selectedTypeId.length != 0 ||
      this.selectedyear != null ||
      this.selectedModelId.length != 0 ||
      this.selectedModels.length != 0 ||
      this.searchText != null ||
      this.selectedTypes.length != 0){
        this.searchApplied = true;
      }

  }

  openDeleteConfirmation(vehicleId: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal ',
    });
    this.deletedVehicleId = vehicleId;
    modalRef.componentInstance.vehicleId = vehicleId;
    modalRef.componentInstance.isFromDealer = true;
    modalRef.componentInstance.deleteSuccessBtnText = 'Back to Vehicle Listing';
  }

  public getVehicleTypes() {
    this.vehicleService.getVehicleTypes().subscribe(
      (res: any) => {
        this.vehicleTypes = res.data;
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  public getVehicleMake(event: any, type_name: any) {
    this.selectedMake = '';
    this.selectedModels = [];
    // this.selectedTypeId = type_id.target.value;

    this.selectedType = type_name;
    this.searchApplied = false;
    let url_param;
    if (event.target.checked) {
      if (this.selectedTypeId.indexOf(event.target.value) < 0) {
        this.selectedTypeId.push(event.target.value);
        this.selectedTypes.push(type_name);
      }
    } else {
      if (this.selectedTypeId.indexOf(event.target.value) > -1) {
        const index = this.selectedTypeId.indexOf(event.target.value);
        this.selectedTypeId.splice(index, 1);
        const nameIndex = this.selectedTypes.indexOf(type_name);
        this.selectedTypes.splice(nameIndex, 1);
      }
    }
    // if (type_id) {
    //   url_param = { vehicleTypeId: type_id.target.value };
    // }
    if (this.selectedTypeId.length > 0) {
      const lengthType = this.selectedTypeId.length;
      url_param = { vehicleTypeId: this.selectedTypeId };
    }
    if (this.selectedTypeId.length > 0) {
      this.vehicleService.getMake(url_param).subscribe(
        (res: any) => {
          this.vehicleMakes = res.data;
          this.popularMakes = res.data.filter((x: any) => x.is_popular);
          this.popularMakes = ArrayHelper.getArrayChunks(this.popularMakes, 3);
          this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
        },
        ({ error, status }) => {
          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      );
    } else {
      this.vehicleMakes = [];
      this.popularMakes = [];
      this.nonPopularMakes = [];
    }
  }

  public getVehicleModel(makeid: any, makename: any) {
    this.selectedMakeId = makeid;
    this.selectedMake = makename;
    this.searchApplied = false;
    this.vehicleService.getModels(makeid).subscribe(
      (res: any) => {
        this.vehicleModels = res.data;
        this.vehicleModelsClone = res.data;
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  public getProvince() {
    this.vehicleService.getProvinceList().subscribe(
      (res: any) => {
        this.province = res.data;
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  searchInput(event: any, filterKey: string) {
    if (filterKey == 'makes') {
      if (event.target.value != '') {
        this.popularMakes = this.vehicleMakes.filter(
          (x: any) =>
            x.is_popular &&
            x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
        this.nonPopularMakes = this.vehicleMakes.filter(
          (x: any) =>
            !x.is_popular &&
            x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.popularMakes = this.vehicleMakes.filter((x: any) => x.is_popular);
        this.nonPopularMakes = this.vehicleMakes.filter(
          (x: any) => !x.is_popular
        );
      }
    } else if (filterKey == 'model') {
      this.vehicleModels = this.vehicleModelsClone;
      if (event.target.value != '') {
        this.vehicleModels = this.vehicleModels.filter(
          (x: any) =>
            x.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      } else {
        this.vehicleModels = this.vehicleModelsClone;
      }
    }
  }

  selectValue(value: any, field: string, model_name?: any, event?: any) {
    if (field == 'model') {
      if (event.target.checked) {
        if (this.selectedModelId.indexOf(value) < 0) {
          this.selectedModelId.push(value);
          this.selectedModels.push(model_name);
        }
      } else {
        if (this.selectedModelId.indexOf(value) > -1) {
          const index = this.selectedModelId.indexOf(value);
          this.selectedModelId.splice(index, 1);
          const nameIndex = this.selectedModels.indexOf(model_name);
          this.selectedModels.splice(nameIndex, 1);
        }
      }
    }else if(field == 'year') {
      this.selectedyear = value;
    }
    else if (field == 'status') {
      if (event.target.checked) {
        if (this.selectedStatusId.indexOf(value) < 0) {
          this.selectedStatusId.push(value);
          this.selectedStatuses.push(model_name);
        }
      } else {
        if (this.selectedStatusId.indexOf(value) > -1) {
          const index = this.selectedStatusId.indexOf(value);
          this.selectedStatusId.splice(index, 1);
          const nameIndex = this.selectedStatuses.indexOf(model_name);
          this.selectedStatuses.splice(nameIndex, 1);
        }
      }
    }
    this.searchApplied = false;
  }

  clearAll() {
    this.page = 1;
    this.selectedMake = null;
    this.selectedType = null;
    this.selectedModel = null;
    this.selectedProvince = undefined;
    this.selectedStatusId = [];
    this.selectedStatuses = [];
    this.selectedMakeId = null;
    this.selectedTypeId = [];
    this.selectedModelId = [];
    this.selectedModels = [];
    this.searchText = null;
    this.selectedyear = null;
    this.searchApplied = false;
    this.selectedTypes = [];
    this.getFilterVehicleList(this.order, '', this.user_province);
    this.searchApplied = false;
  }

  /*findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
        console.log(position);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    navigator.permissions.query({ name: 'geolocation' }).then((res: any) => {
      if (res.state == 'prompt') {
        this.getFilterVehicleList(
          this.order,
          '',
          this.user_province
        );
      }
      if (res.state == 'denied') {
        this.getFilterVehicleList(
          this.order,
          '',
          this.user_province
        );
      }
    });
  }

  showPosition(position: any) {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    let request: any = {
      latLng: latlng,
    };
    geocoder.geocode(request, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results[0], 'console.log(address);');
        if (results[0] != null) {
          var user_province = results[0].address_components.filter(
            (ac) => ~ac.types.indexOf('administrative_area_level_1')
          )[0].long_name;
          let address = results[0].formatted_address;
          this.user_province = user_province;
          if (this.user_province) {
            this.getFilterVehicleList(
              this.order,
              '',
              this.user_province
            );
          }
          console.log('sdsdd', user_province); //<<<=== BUT here it Prints the correct value to the console !!!
        } else {
          alert('No address available');
        }
      }
    });
  }*/

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    if (this.selectedTab === 'all') {
      if (this.searchText) {
        let param = {
          page: 1,
          limit: 10,
          search: this.searchText,
          order: this.order
        };

        this.getAllVehicleList(param);
      } else {
        let param = {
          page: 1,
          limit: 10,
          order: this.order
        };
        this.getAllVehicleList(param);
      }
    } else {
      if (this.searchText) {
        let param = {
          page: 1,
          limit: 10,
          condition: this.selectedTab,
          search: this.searchText,
          order: this.order
        };
        this.getAllVehicleList(param);
      } else {
        let param = {
          page: 1,
          limit: 10,
          condition: this.selectedTab,
          order: this.order
        };
        this.getAllVehicleList(param);
      }
    }
  }

  removeType(type: string) {
    const typeId = this.vehicleTypes.find((x: any) => x.type == type).id;
    this.selectedTypeId.splice(this.selectedTypeId.indexOf(typeId), 1);
    this.selectedTypes.splice(this.selectedTypes.indexOf(type), 1);
    // this.getVehicleMakes();
    this.selectedMake = '';
    this.selectedModels = [];
    this.getFilterVehicleList(this.order, '', this.user_province);
  }

  removeModel(model: string) {
    const modelId = this.vehicleModels.find((x: any) => x.name == model).id;
    this.selectedModelId.splice(this.selectedModelId.indexOf(modelId), 1);
    this.selectedModels.splice(this.selectedModels.indexOf(model), 1);
    this.getFilterVehicleList(this.order, '', this.user_province);
  }

  removeStatus(status: string) {
    const statusId = this.statusList.find((x: any) => x.status == status);
    this.selectedStatusId.splice(
      this.selectedStatusId.indexOf(statusId?.id),
      1
    );
    this.selectedStatuses.splice(this.selectedStatuses.indexOf(status), 1);
    this.getFilterVehicleList(this.order, '', this.user_province);
  }

  checkVehicleType(){
    if(this.selectedTypeId.length == 0 ){
      this.popularMakes = [];
      this.nonPopularMakes = [];
      this.toastr.warning(this.translate.instant('Please Select Vehicle Type'));
      return;
    }
  }
}
