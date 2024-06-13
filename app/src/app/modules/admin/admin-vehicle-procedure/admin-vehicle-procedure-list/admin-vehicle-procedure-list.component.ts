import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { AdminVehicleProcedureService } from '../admin-vehicle-procedure.service';
import { PaginationData } from '../../admin-vehicles/models/vehicle.model';
import { Error } from 'src/app/shared/models/error.model';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { VehicleProcedure } from '../../../sellers/seller-orders/seller-order.model';

@Component({
  selector: 'app-admin-vehicle-procedure-list',
  templateUrl: './admin-vehicle-procedure-list.component.html',
  styleUrls: ['./admin-vehicle-procedure-list.component.scss']
})
export class AdminVehicleProcedureListComponent implements OnInit {

  // companyList and pagination variables
  selectedTab = 'in_progress';
  companyList: Array<any> = [];
  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();

  //loading variable
  loading: boolean = true;

  //filter variable
  isSearchApplied:boolean = false;
  sortBy: string = 'id';
  order: string = 'DESC';
  sortingOrder: boolean = true;
  searchText: string = '';
  updatedSearchText: string = '';
  allFilterParams: any = {};
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  constructor(
    private adminVehicleProcedureService: AdminVehicleProcedureService,
    public router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private translate:TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //according the screen size getting the company list
    if (window.innerWidth < 768) {
      this.limit = 10;
      this.getAllCompanyList({ page: this.page, limit: this.limit, order: this.order, order_by: this.sortBy, status:this.selectedTab });
    } else {
      this.limit = 15;
      this.getAllCompanyList({ page: this.page, limit: this.limit, order: this.order, order_by: this.sortBy, status:this.selectedTab });
    }
    this.userRolePermission()
  }

  userRolePermission() {

    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'company_management')
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
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: UserPermission) => x.module_name == ModuleName.ProcedureManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  //this function is used to get companies list
  getAllCompanyList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.adminVehicleProcedureService.getCompanyList(this.allFilterParams).subscribe({
      next: (res: any) => {
        this.companyList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    });
  }

  //this function is called if pagination changed
  jumpToThePage(page:number){
    this.page = page;
    this.allFilterParams.page = page;
    this.getAllCompanyList( this.allFilterParams);
  }

  // this function is used to get company list on the behalf on filter
  getFilterUserList(isFormSearchbutton: boolean = false) {
    let url_param: any = {};
    if (isFormSearchbutton) {
      this.page = 1;
      this.isSearchApplied = true;
      this.searchText = this.updatedSearchText;
    }
    if (this.searchText) {
      url_param['search'] = this.searchText;
    }
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    url_param['order'] = this.order;
    url_param['order_by'] = this.sortBy;
    url_param['status'] = this.selectedTab;
    this.getAllCompanyList(url_param);
  }

  //this function is used to set the sorting type
  setSorting(sortingBy: string = '') {
    this.sortingOrder = this.sortBy != sortingBy ? this.sortingOrder : !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterUserList();
  }

  //this function is used to
  public gotoCompanyDetail(companyData: any) {
    localStorage.setItem(companyData.id, JSON.stringify(companyData));
    this.router.navigate(['/admin/vehicle-procedure/details/', companyData.id]);
  }

  public searchTextChange(event: any) {
    this.isSearchApplied = false;
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    this.page = 1;
    this.limit = 10;
    this.getFilterUserList();
  }

}
