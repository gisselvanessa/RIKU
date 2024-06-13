import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { PaginationData } from '../../admin-vehicles/models/vehicle.model';
import { AdminUsersService } from '../admin-users.service';
import { DeleteUsertypeComponent } from 'src/app/shared/modals/admin/delete-usertype/delete-usertype.component';
import { ActivateDeactivateComponent } from '../activate-deactivate/activate-deactivate.component';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UsersListComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  page: number = 1;
  limit: number;
  isEnableNext: boolean = false;
  getScreenWidth: any;
  deletedUserId: string;
  statusUserId: string;
  selectedStatus: any;
  searchApplied: boolean = false;
  active = 'all';
  statusList = [{ id: 'ACTIVE', status: 'Active' },
  { id: 'INACTIVE', status: 'Inactive' }];
  paginationData: PaginationData = new PaginationData();
  userList: Array<any> = [];
  sortBy: string = 'REG_DATE';
  order: string = 'DESC';
  sortingOrder: boolean = true;
  selectedTab = 'all';
  searchText: string = '';
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;
  allFilterParams: any = {};
  constructor(private adminUserService: AdminUsersService,
    public router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private modalService: NgbModal, private translate: TranslateService, private userPermissionService: UserPermissionService, private userService: UserService) {
  }

  ngOnInit(): void {
    //this.userRolePermission();
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: UserPermission) => x.module_name == ModuleName.UserManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }

    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 15;
    }
    let userSearchParam: any = localStorage.getItem('userSearchParams');
    if (userSearchParam) {
      userSearchParam = JSON.parse(userSearchParam);
      if (userSearchParam.page) {
        this.page = userSearchParam.page;
      }
      if (userSearchParam.limit) {
        this.limit = userSearchParam.limit;
      }
      if (userSearchParam.search) {
        this.searchApplied = true;
        this.searchText = userSearchParam.search;
      }
      if (userSearchParam.sortBy) {
        this.searchApplied = true;
        this.sortBy = userSearchParam.sortBy;
      }
      if (userSearchParam.sortOrder) {
        this.searchApplied = true;
        this.order = userSearchParam.sortOrder;
      }
      if (userSearchParam.statusRole) {
        this.searchApplied = true;
        this.selectedStatus = userSearchParam.statusRole;
      }
      if (userSearchParam.userType) {
        this.searchApplied = true;
        this.selectedTab = userSearchParam.userType;
      }
      this.getAllUserList(userSearchParam);
    } else {
      this.getAllUserList({ page: this.page, limit: this.limit });
    }
    this.adminUserService.getDeleteRole.subscribe((deletedObj) => {
      if (deletedObj.user_id == this.deletedUserId) {
        const deleteUserIndex = this.userList.findIndex((x: any) =>
          x.user_id == this.deletedUserId);
        if (deleteUserIndex > -1) {
          if (this.userList[deleteUserIndex].user_type.length > 1) {
            if (this.userList[deleteUserIndex].user_type.length == deletedObj.type.length) {
              this.userList.splice(deleteUserIndex, 1);
            } else {
              deletedObj.type.forEach((type: any) => {
                const deleteUserTypeIndex = this.userList[deleteUserIndex].user_type.findIndex((x: any) => x.type == type);
                if (deleteUserTypeIndex > -1) {
                  this.userList[deleteUserIndex].user_type.splice(deleteUserTypeIndex, 1);
                }
              })
            }
          } else {
            this.userList.splice(deleteUserIndex, 1);
          }
        }
      }
    })
  }

  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'user_management')
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
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.UserManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    this.page = 1;
    this.getFilterUserList();
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = page;
    this.getAllUserList(this.allFilterParams);
  }


  changeStatus(event: any, i: any, indexOfToggle?: any) {
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    this.statusUserId = this.userList[i].user_id;
    modalRef.componentInstance.userId = this.userList[i].user_id;
    const message = this.translate.instant("Back to User Listing")
    modalRef.componentInstance.changeSuccessBtnText = message;
    modalRef.componentInstance.userType = this.userList[i].user_type[indexOfToggle].type
    modalRef.componentInstance.userStatus = this.userList[i].user_type[indexOfToggle].status
    modalRef.componentInstance.active = event.target.checked;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'cancel' || resp == 0) {
        event.target.checked = !event.target.checked;
        this.userList[i].user_type[indexOfToggle].status = event.target.checked ? 'Active' : 'Inactive';
      }
      else if (resp === 'confirm') {
        if (this.selectedTab == 'all') {
          this.getAllUserList({ page: this.page, limit: this.limit })
        } else {
          this.getAllUserList({ page: this.page, limit: this.limit, userType: this.selectedTab })
        }
      }
    })
  }

  getAllUserList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    localStorage.setItem('userSearchParams', JSON.stringify(this.allFilterParams));
    this.adminUserService.getUserList(this.allFilterParams).subscribe((res: any) => {
      this.userList = res.data.items ? res.data.items : [];
      this.paginationData = res.data.pagination;
      if (this.paginationData.total_pages > 1) {
        this.isEnableNext = true;
      }
      this.loading = false;
    },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      });
  }

  getFilterUserList() {
    let url_param: any = {};
    if (this.selectedStatus) {
      this.page = 1;
      if (this.selectedTab == 'all') {
        url_param['status'] = this.selectedStatus;
      } else {
        url_param['userType'] = this.selectedTab
        url_param['statusRole'] = this.selectedStatus
      }
    }
    if (this.searchText) {
      url_param['search'] = this.searchText;
    }
    if (this.selectedTab !== 'all') {
      url_param['userType'] = this.selectedTab
    }
    url_param['sortOrder'] = this.order;
    url_param['sortBy'] = this.sortBy;
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    this.getAllUserList(url_param);
    this.searchApplied = true;
  }

  selectValue(value: any, field: string) {
    if (field == 'status') {
      this.selectedStatus = value;
    }
  }

  clearAll() {
    this.selectedStatus = null;
    this.searchText = '';
    this.page = 1;
    this.getFilterUserList();
    this.searchApplied = false;
  }

  editUser(userId: any) {
    this.router.navigate([`/admin/users/edit/${userId}`])
  }

  deleteUser(index: any) {
    if (this.userList[index].user_type.length > 1) {
      const modalRef = this.modalService.open(DeleteUsertypeComponent, {
        windowClass: 'delete-vehicle-modal'
      })
      this.deletedUserId = this.userList[index].user_id;
      modalRef.componentInstance.userId = this.userList[index].user_id;
      const message = this.translate.instant("Back to User Listing")
      modalRef.componentInstance.deleteSuccessBtnText = message;
      modalRef.componentInstance.userType = this.userList[index].user_type.map((x: any) => x.type);
    } else {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, {
        windowClass: 'delete-vehicle-modal'
      })
      this.deletedUserId = this.userList[index].user_id;
      modalRef.componentInstance.userId = this.userList[index].user_id;
      modalRef.componentInstance.isFromAdmin = true;
      const message = this.translate.instant("Back to User Listing")
      modalRef.componentInstance.deleteSuccessBtnText = message;
      modalRef.componentInstance.user_type.push(this.userList[index].user_type[0].type)

    }

  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sortBy != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterUserList();
  }

  ngOnDestroy() {
    localStorage.removeItem('userSearchParams');
  }

}
