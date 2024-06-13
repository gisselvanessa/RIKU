import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { AdminVehicleService } from '../admin-vehicles.service';
import { PaginationData, Vehicle } from '../models/vehicle.model';
import { VehicleMasterDataService } from '../vehicle-master-data.service';
import { Error } from 'src/app/shared/models/error.model';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { ArrayHelper } from 'src/app/shared/helpers/array-helper';
import { TranslateService } from '@ngx-translate/core';
import { RejectVehicleConfirmationComponent } from 'src/app/shared/modals/admin/reject-vehicle-confirmation/reject-vehicle-confirmation.component';


@Component({
  selector: 'app-admin-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdminVehicleListComponent implements OnInit {
  user: any;
  vehicleListData: any;
  loading: any = true;
  page: any = 1;
  limit: any = 10;
  isEnableNext: boolean = false;
  isEnablePrevious: boolean = false;
  getScreenWidth: any;
  deletedVehicleId: string = '';
  typeIsSeller: any;
  vehicleMakeYears = [];
  vehicleModels: any = [];
  vehicleModelsClone: any;
  popularMakes: any = [];
  nonPopularMakes: any = [];
  makeId: any;
  vehicleTypes: any;
  vehicleMakes: any;
  province: any;
  selectedMake: any;
  selectedType: any;
  selectedModel: any;
  selectedProvince: any;
  selectedStatus: any;
  selectedMakeId: any;
  selectedTypeId: any = [];
  selectedTypes: any = [];
  selectedModelId: any = [];
  selectedModels: any = [];


  user_province: any = '';
  searchApplied: boolean = false;
  active = 'all';
  statusList = [{ id: 'approved', status: 'Approved' },
  { id: 'rejected', status: 'Rejected' },
  { id: 'pending', status: 'Awaiting Approval' },
  { id: 'draft', status: 'Draft' }];
  paginationData: PaginationData = new PaginationData();
  vehicleList: Array<Vehicle> = [];
  sortBy: string = 'VEHICLE_ID';
  order: any = 'DESC';
  sortingOrder: boolean = true;
  selectedTab = 'All';
  searchText: string = '';
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;
  isApproved: any = undefined;

  constructor(private adminVehicleService: AdminVehicleService,
    public router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private vehicleMasterDataService: VehicleMasterDataService,
    private modalService: NgbModal, private translate: TranslateService, private userPermissionService: UserPermissionService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.getVehicleTypes();
    this.getProvince();

    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
      this.selectTab('all')
    } else {
      this.limit = 15;
      this.selectTab('all')
    }
    this.adminVehicleService.getDeletedVehicleStatus.subscribe((isDeleted) => {
      if (isDeleted) {
        const deleteVehicleIndex = this.vehicleList.findIndex((x: any) => x.uuid == this.deletedVehicleId);
        if (deleteVehicleIndex > -1) {
          this.vehicleList.splice(deleteVehicleIndex, 1);
        }
      }
    })
    this.userRolePermission()
  }
  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'vehicles')
    //     this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions
    //   })
    // } else {
    //   this.modulePermissions.can_create = true;
    //   this.modulePermissions.can_delete = true;
    //   this.modulePermissions.can_edit = true;
    //   this.modulePermissions.can_export = true;
    //   this.modulePermissions.can_list = true;
    //   this.modulePermissions.can_view_details = true;
    // }
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.VehicleManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    if (this.selectedTab === 'all') {
      if (this.searchText) {
        let param = {
          page: 1,
          limit: this.limit,
          search: this.searchText
        }
        this.getAllVehicleList(param)
      } else {
        let param = {
          page: 1,
          limit: this.limit
        }
        this.getAllVehicleList(param)
      }
    } else {
      if (this.searchText) {
        let param = {
          page: 1,
          limit: this.limit,
          status: this.selectedTab,
          search: this.searchText

        }
        this.getAllVehicleList(param)
      } else {
        let param = {
          page: 1,
          limit: this.limit,
          status: this.selectedTab
        }
        this.getAllVehicleList(param)
      }
    }
  }

  paginationForwardPrevious(isEnableNext: boolean, isEnablePrevious: boolean) {
    if (isEnableNext && this.paginationData.current_page < this.paginationData.total_pages) {
      this.isEnableNext = true;
      this.isEnablePrevious = false;
      this.page = this.paginationData.current_page + 1;
      this.getFilterVehicleList()
      // if (this.selectedTab === 'all') {
      //   // if (this.searchText) {
      //   //   this.getAllVehicleList({ search: this.searchText, page: this.page, limit: this.limit })
      //   // } else {
      //   //   this.getAllVehicleList({ page: this.page, limit: this.limit });
      //   // }


      // } else {
      //   // if (this.searchText) {
      //   //   this.getAllVehicleList({ status: this.selectedTab, search: this.searchText, page: this.page, limit: this.limit })
      //   // } else {
      //   //   this.getAllVehicleList({ status: this.selectedTab, page: this.page, limit: this.limit });
      //   // }


      // }

    }
    if (isEnablePrevious && this.page > 1) {
      this.isEnableNext = false;
      this.isEnablePrevious = true;
      this.page = this.paginationData.current_page - 1;
      this.getFilterVehicleList()
      // if (this.selectedTab === 'all') {
      //   // if (this.searchText) {
      //   //   this.getAllVehicleList({ search: this.searchText, page: this.page, limit: this.limit })
      //   // } else {
      //   //   this.getAllVehicleList({ page: this.page, limit: this.limit });
      //   // }

      // } else {
      //   // if (this.searchText) {
      //   //   this.getAllVehicleList({ status: this.selectedTab, search: this.searchText, page: this.page, limit: this.limit })
      //   // } else {
      //   //   this.getAllVehicleList({ status: this.selectedTab, page: this.page, limit: this.limit });
      //   // }

      // }

    }
  }

  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = 'https://devjak-images.s3.amazonaws.com/vehicles/car.png';
  }

  getAllVehicleList(params: any): void {
    this.loading = true;
    this.adminVehicleService.getVehicleList(params).subscribe((res: any) => {
      this.vehicleList = res.data.items;
      this.paginationData = res.data.pagination;
      if (this.paginationData.total_pages > 1) {
        this.isEnableNext = true;
      }
      this.loading = false;
    },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      });
  }

  setSearchText(){
    if (this.searchText && this.searchText.trim() != '') {
      this.getFilterVehicleList();
    }
  }

  getFilterVehicleList(order?: any, provience?: any, user_province?: any) {
    if (order) {
      this.order = order;
    }
    if (provience) {
      this.selectedProvince = provience;
    }
    let url_param: any = {};
    let filter_search:any={};
    if (this.selectedMakeId) {
      url_param['make'] = this.selectedMakeId;
      filter_search['make'] = this.selectedMakeId
    }

    if(this.selectedTab != 'all'){
      url_param['status'] = this.selectedTab
    }
    if (this.selectedModelId.length > 0) {
      url_param['model'] = this.selectedModelId.join(',').replaceAll(/\s/g, '');
      filter_search['model']=this.selectedModelId
    }
    if (this.selectedStatus) {
      url_param['status'] = this.selectedStatus;
    }
    if (this.searchText && this.searchText.trim() != '') {
      url_param['search'] = this.searchText;
      filter_search['search'] = this.searchText;
    }
    if (this.selectedProvince) {
      url_param['location'] = this.selectedProvince;
      filter_search['location'] = this.selectedProvince
    }
    if (this.selectedTypeId.length > 0) {
      url_param['vehicle_type'] = this.selectedTypeId.join(',').replaceAll(/\s/g, '');
      filter_search['vehicle_type'] = this.selectedTypeId
    }
    url_param['sortOrder'] = this.order;
    url_param['sortBy'] = this.sortBy;
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    this.getAllVehicleList(url_param);
    console.log(filter_search)
    if(Object.keys(filter_search).length != 0){
      this.searchApplied = true;
    }else{
      this.searchApplied = false;
    }

  }


  removeType(type: string) {
    const typeId = this.vehicleTypes.find((x: any) => x.type == type).id;
    this.selectedTypeId.splice(this.selectedTypeId.indexOf(typeId), 1);
    this.selectedTypes.splice(this.selectedTypes.indexOf(type), 1);
    // this.getVehicleMakes();
    this.selectedMake = null
    this.selectedMakeId = null
    this.selectedModels = []
    this.selectedModelId = []

    this.getFilterVehicleList();
  }

  removeModel(model: string) {
    const modelId = this.vehicleModels.find((x: any) => x.name == model).id;
    this.selectedModelId.splice(this.selectedModelId.indexOf(modelId), 1);
    this.selectedModels.splice(this.selectedModels.indexOf(model), 1);
    this.getFilterVehicleList();
  }

  openDeleteConfirmation(vehicleId: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal '
    })
    this.deletedVehicleId = vehicleId;
    modalRef.componentInstance.vehicleId = vehicleId;
  }


  public getVehicleTypes() {
    this.vehicleMasterDataService.getVehicleTypes().pipe().subscribe({
      next: (res: any) => {
        this.vehicleTypes = res.data;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    });
  }

  selectProvince(event: any) {
    this.selectedProvince = event.target.value
  }

  public getVehicleMake(event: any, type_name: any) {
    this.selectedMake = ''
    this.selectedModels = []
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
    this.searchApplied = false;
    this.getVehicleMakes();
  }

  public getVehicleMakes() {
    if (this.selectedTypeId.length > 0) {
      this.vehicleMasterDataService.getMake(this.selectedTypeId.join(',').replaceAll(/\s/g, '')).subscribe((res: any) => {
        this.vehicleMakes = res.data;
        // this.popularMakes = res.data.filter((x: any) => x.is_popular);
        // this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
        this.popularMakes = ArrayHelper.getArrayChunks(res.data.filter((x: any) => x.is_popular), 4);
        this.nonPopularMakes = res.data.filter((x: any) => !x.is_popular);
      }, (error: any) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      });
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
    this.vehicleMasterDataService.getModels(makeid).subscribe({
      next: (res: any) => {
        this.vehicleModels = res.data;
        this.vehicleModelsClone = res.data;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    });
  }

  public getProvince() {
    this.vehicleMasterDataService.getProvinceList().subscribe({
      next: (res: any) => {
        this.province = res.data;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
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
    } else if (filterKey == 'province') {
      if (event.target.value != '') {
        this.province = this.province.filter((x: any) => {
          x.toLowerCase().includes(event.target.value.toLowerCase())
        });
      } else {
        this.province = this.province
      }

    }
  }

  selectValue(event: any, value: any, model_name?: any) {

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
    this.searchApplied = false;
  }

  clearAll() {
    this.selectedMake = null;
    this.selectedType = null;
    this.selectedModel = null;
    this.selectedProvince = null;
    this.selectedStatus = null;
    this.selectedMakeId = null;
    this.selectedTypeId = [];
    this.selectedModelId = [];
    this.selectedTypes = [];
    this.vehicleMakes = [];
    this.popularMakes = [];
    this.nonPopularMakes = [];
    this.selectedModels = [];
    this.searchText = '';
    this.getFilterVehicleList();
    this.vehicleModels = []
    this.searchApplied = false;
  }

  deleteVehicle(vehicleId: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal '
    })
    this.deletedVehicleId = vehicleId;
    modalRef.componentInstance.vehicleId = vehicleId;
    modalRef.componentInstance.isFromAdmin = true;
    const message = this.translate.instant("Back to Vehicle Listing")
    modalRef.componentInstance.deleteSuccessBtnText = message;
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterVehicleList();
  }


  jumpToThePage(page: number) {
    this.page = page;
    this.getFilterVehicleList()
    // if (this.selectedTab === 'all') {
    //   if (this.searchText) {
    //     this.getAllVehicleList({ search: this.searchText, page: this.page, limit: this.limit })
    //   } else {
    //     this.getAllVehicleList({ page: this.page, limit: this.limit });
    //   }

    // } else {
    //   if (this.searchText) {
    //     this.getAllVehicleList({ status: this.selectedTab, search: this.searchText, page: this.page, limit: this.limit })
    //   } else {
    //     this.getAllVehicleList({ status: this.selectedTab, page: this.page, limit: this.limit });
    //   }

    // }
  }

  onChangeStatus(isApproved: boolean, vehicleId: any, index: number) {
    this.isApproved = isApproved;
    this.approveRejectVehicle(vehicleId, index);
  }


  approveRejectVehicle(vehicleId: any, index: number): void {

    if (this.isApproved === undefined) {
      this.toastr.warning(this.translate.instant('Please select approve or reject first!!'));
      return;
    }
    const modalRef = this.modalService.open(RejectVehicleConfirmationComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    modalRef.componentInstance.vehicleId =  vehicleId;
    modalRef.componentInstance.approveRejectflg = this.isApproved;
    modalRef.componentInstance.isFromListing = true;
    modalRef.result.then((res)=>{
    }).catch((error)=>{
      if (error == 'Cross click') {
        this.isApproved = undefined;
      } else if (error.success_code == 'VEHICLE_APPROVED_SUCCESSFULLY') {
        this.vehicleList[index].status = 'approved';
        this.isApproved = undefined;
      }
    });
  }

}
