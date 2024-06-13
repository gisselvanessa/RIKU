import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AdminVehicleService } from '../../admin-vehicles/admin-vehicles.service';

import { Error } from 'src/app/shared/models/error.model';
import { ModuleName, ModulePermissions } from 'src/app/modules/admin/permission.model';
import { ModulePermission } from '../../roles/role.model';
import { DeleteVehicleDialogComponent } from 'src/app/shared/modals/delete-vehicle-dialog/delete-vehicle-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { TranslateService } from '@ngx-translate/core';
import { VehicleListResponse } from '../../admin-vehicles/models/vehicle.model';


@Component({
  selector: 'app-recently-added-vehicles',
  templateUrl: './recently-added-vehicles.component.html',
  styleUrls: ['./recently-added-vehicles.component.scss']
})

export class RecentlyAddedVehiclesComponent implements OnInit {
  selectedTab: string = 'all';
  modulePermissions: any = new ModulePermission();
  loading: boolean = false;
  vehicleList: any = [];
  sortBy: string = 'LISTED_DATE';
  order: any = 'DESC';
  sortingOrder: boolean = true;
  errorMessage: string;

  constructor(private adminVehicleService: AdminVehicleService,
    private toastr: ToastrService, private modalService: NgbModal,
    private activatedRoute: ActivatedRoute, private translate: TranslateService) { }


  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.VehicleManagement);
      if(!module.module_permissions.can_list){
        this.errorMessage = "You are not authorized to access this module";
       }
      this.modulePermissions = module ? module.module_permissions : new ModulePermission();

    }
    this.getFilterVehicleList();

  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterVehicleList();
  }

  getFilterVehicleList(order?: any, provience?: any, user_province?: any) {
    if (order) {
      this.order = order;
    }
    const url_param: any = {};
    if (this.selectedTab != 'all') {
      url_param['condition'] = this.selectedTab;
    }
    url_param['sortOrder'] = this.order;
    url_param['sortBy'] = this.sortBy;
    url_param['page'] = 1;
    url_param['limit'] = 10;
    this.getRecentlyAddedVehicles(url_param);
  }

  getRecentlyAddedVehicles(params: any): void {
    this.loading = true;
    this.adminVehicleService.getVehicleList(params).subscribe({
      next: (res: VehicleListResponse) => {
        this.loading = false;
        this.vehicleList = res.data.items;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          if(!this.errorMessage){
            this.toastr.error(error.error[0]);
          }
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
    this.getFilterVehicleList();
  }

  deleteVehicle(vehicleId: string) {
    const modalRef = this.modalService.open(DeleteVehicleDialogComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.vehicleId = vehicleId;
    modalRef.result.then((isVehicleDeleted: boolean) => {
      if (isVehicleDeleted) {
        const vehicleIndex = this.vehicleList.findIndex((x: any) => x.uuid == vehicleId);
        if (vehicleIndex > -1) {
          this.vehicleList.splice(vehicleIndex, 1);
        }
        this.toastr.success(this.translate.instant('Vehicle deleted successfully!!'));
      }
    });
  }
}
