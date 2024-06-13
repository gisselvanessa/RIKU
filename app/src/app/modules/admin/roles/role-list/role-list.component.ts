import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { RolesService } from '../roles.service';

import { PaginationData } from '../../admin-vehicles/models/vehicle.model';
import { DeleteRoleComponent } from '../delete-role-dialog/delete-role.component';
import { SuccessfullComponent } from '../../../../shared/modals/successfull/successfull.component';
import { ActivateDeactivateRoleComponent } from '../activate-deactivate-role-dialog/activate-deactivate-role.component';
import { ErrorResponse, RoleListResponse } from '../role.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent implements OnInit {

   // roleList and pagination variables
   roleList: Array<any> = [];
   page: number = 1;
   limit: number;
   paginationData: PaginationData = new PaginationData();

   //loading variable
   loading: boolean = false;
   //filter variable
   sortBy: string = 'created_at';
   order: string = 'DESC';
   sortingOrder: boolean = true;
   searchText: string = '';
   updatedSearchText: string = '';
   statusList = ['Active', 'Inactive'];
   selectedStatus: string = '';
   searchApplied: boolean = false;
   allFilterParams: any = {};
   permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

   constructor(
    private rolesService: RolesService,
    public router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private userService:UserService,
    private userPermissionService: UserPermissionService,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    //according the screen size getting the company list
    if (window.innerWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 15;
    }
    if (this.activatedRoute.snapshot.data['roles']['data']['items']) {
      this.roleList = this.activatedRoute.snapshot.data['roles']['data']['items'];
      this.paginationData = this.activatedRoute.snapshot.data['roles']['data']['pagination'];
    } else {
      this.getAllRoleList({ page: 1, limit: this.limit, sortBy:this.sortBy, sortOrder:this.order});
    }
    this.userRolePermission()
  }
  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'role_management')
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
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.RoleManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  setStatus(event: any, value: string) {
    if (event.target.checked) {
      this.selectedStatus = value;
    } else {
      this.selectedStatus = '';
    }
  }

  //this function is used to get companies list
  getAllRoleList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.rolesService.getRoleList(this.allFilterParams).subscribe({
      next: (res: RoleListResponse) => {
        this.roleList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
      },
      error: (errorRes:ErrorResponse) => {
        this.loading = false;
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

  //this function is called if pagination changed
  jumpToThePage(page:number){
    this.page = page;
    this.allFilterParams.page = page;
    this.allFilterParams.limit = this.limit;
    this.getAllRoleList( this.allFilterParams);
  }


  // this function is used to get company list on the behalf on filteration
  getFilterRoleList(manualSearch: boolean = false) {
    let url_param: any = {};
    if (manualSearch) {
      this.page = 1;
      this.searchApplied = true;
      this.searchText = this.updatedSearchText;
    }
    if (this.searchText && this.searchText.trim() != '') {
      url_param['search'] = this.searchText;
    }
    if (this.selectedStatus != '') {
      url_param['status'] = this.selectedStatus == 'Active' ?  true : false;
    }
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    url_param['sortBy'] = this.sortBy;
    url_param['sortOrder'] = this.order;
    this.getAllRoleList(url_param);
  }

  //this function is used to set the sorting type
  setSorting(sortingBy: string = '') {
    this.sortingOrder = this.sortBy != sortingBy ? this.sortingOrder : !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterRoleList();
  }

  clearAll() {
    this.page = 1;
    this.selectedStatus = '';
    this.searchText = '';
    this.updatedSearchText = '';
    this.searchApplied = false;
    this.getFilterRoleList();
  }


  changeStatus(event: any, index: number) {
    const modalRef = this.modalService.open(ActivateDeactivateRoleComponent, {
      windowClass: 'change-role-status-modal'
    })
    modalRef.componentInstance.roleId = this.roleList[index].id;
    modalRef.componentInstance.isActivate = event.target.checked;
    modalRef.result.then((isStatusChanged: boolean) => {
      if (isStatusChanged) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-role-modal'
        })
        modalRef.componentInstance.isRoleStatusChanged = true;
        modalRef.componentInstance.isRoleActivate = event.target.checked;
        this.roleList[index].status = event.target.checked;
      } else {
        this.roleList[index].status = !event.target.checked;
      }
    }).catch((error) => {
      if(error !== true && error !== 0){
        const message = this.translate.instant('Something Went Wrong Please Try again later')
        this.toastr.error(message);
      }else{
        this.roleList[index].status = !event.target.checked;
      }
    });
  }


  //this funtion is used to open delete medel
  deleteRole(roleId: string) {
    const modalRef = this.modalService.open(DeleteRoleComponent, {
      windowClass: 'delete-role-modal'
    })
    modalRef.componentInstance.roleId = roleId;
    modalRef.result.then((isRoleDeleted) => {
      if (isRoleDeleted) {
        const roleIndex = this.roleList.findIndex((x) => x.id == roleId);
        if(roleIndex > -1){
          this.roleList.splice(roleIndex, 1);
        }
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-role-modal'
        })
        modalRef.componentInstance.roleDeleted = true;
      }
    }).catch((error) => {
      if(error !== true && error !== 0){
        const message = this.translate.instant('Something Went Wrong Please Try again later')
        this.toastr.error(message);
      }
    });
  }


}
