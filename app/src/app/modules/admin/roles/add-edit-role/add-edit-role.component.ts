import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { RolesService } from '../roles.service';

import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { DeleteRoleComponent } from '../delete-role-dialog/delete-role.component';
import { ActivateDeactivateRoleComponent } from '../activate-deactivate-role-dialog/activate-deactivate-role.component';
import { Permission, Role, ErrorResponse } from '../role.model';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ModulePermissions, UserPermission } from '../../permission.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss']
})

export class AddEditRoleComponent implements OnInit {

  roleId: string | undefined;
  roleDetail: Role = new Role();
  permissions: Array<any> = [];
  roleName: string;
  loading: boolean = false;
  submitted: boolean = false;
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;
  permission_names: Array<string> = ['can_list', 'can_view_details', 'can_create', 'can_edit', 'can_delete', 'can_export'];
  constructor(private activatedRoute: ActivatedRoute, private modalService: NgbModal, private toastr: ToastrService,
    private rolesService: RolesService, private router: Router, private location: Location, private userService: UserService,
    private userPermissionService: UserPermissionService,private translate:TranslateService) {
  }

  ngOnInit() {
    this.roleId = this.activatedRoute.snapshot.paramMap.get('id') || undefined;
    if (this.roleId) {
      this.getRoleDetail(this.roleId);
    } else {
      this.permissions = this.rolesService.getModuleAndPermissions();
    }
    this.userRolePermission()
  }
  userRolePermission() {
    if (this.userService.getUserType() === 'admin') {
      this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
        this.permissionModule = resp.data.permissions
        const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'role_management')
        this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions
      })
    } else {
      this.modulePermissions.can_create = true;
      this.modulePermissions.can_delete = true;
      this.modulePermissions.can_edit = true;
      this.modulePermissions.can_export = true;
      this.modulePermissions.can_list = true;
      this.modulePermissions.can_view_details = true;
    }
  }

  onChangePermission(event: any, moduleName: string, permissionName: string) {
    const index: number = this.permissions.findIndex((x: Permission) => x.module_name == moduleName);
    if (permissionName === 'can_create') {
      this.permissions[index].module_permissions[permissionName] = event.target.checked;
      if (event.target.checked === true) {
        this.permissions[index].module_permissions['can_list'] = true;
      } else if (event.target.checked === false) {
        if (this.permissions[index].module_permissions['can_edit'] == true || this.permissions[index].module_permissions['can_view_details'] == true || this.permissions[index].module_permissions['can_delete'] == true) {
          this.permissions[index].module_permissions['can_list'] = true;
          this.permissions[index].module_permissions['can_view_details'] = true;
        } else {
          this.permissions[index].module_permissions['can_list'] = false;
        }
      }
    } else if (permissionName === 'can_delete') {
      this.permissions[index].module_permissions[permissionName] = event.target.checked;
      if (event.target.checked === true) {
        this.permissions[index].module_permissions['can_list'] = true;
      } else if (event.target.checked === false) {
        if (this.permissions[index].module_permissions['can_edit'] == true || this.permissions[index].module_permissions['can_view_details'] == true || this.permissions[index].module_permissions['can_create'] == true) {
          this.permissions[index].module_permissions['can_list'] = true;
          this.permissions[index].module_permissions['can_view_details'] = true;
        } else {
          this.permissions[index].module_permissions['can_list'] = false;
        }

      }
    } else if (permissionName === 'can_edit') {
      this.permissions[index].module_permissions[permissionName] = event.target.checked;
      if (event.target.checked === true) {
        this.permissions[index].module_permissions['can_list'] = true;
        this.permissions[index].module_permissions['can_view_details'] = true;
      } else if (event.target.checked === false) {
        if (this.permissions[index].module_permissions['can_delete'] == true || this.permissions[index].module_permissions['can_create'] == true) {
          this.permissions[index].module_permissions['can_list'] = true;
        } else {
          this.permissions[index].module_permissions['can_list'] = false;
          this.permissions[index].module_permissions['can_view_details'] = false;
        }
      }
    } else if (permissionName === 'can_export') {
      this.permissions[index].module_permissions[permissionName] = event.target.checked;
      if (event.target.checked === true) {
        this.permissions[index].module_permissions['can_list'] = true;
        this.permissions[index].module_permissions['can_view_details'] = true;
      } else if (event.target.checked === false) {
        if (this.permissions[index].module_permissions['can_view_details'] == true || this.permissions[index].module_permissions['can_edit'] == true || this.permissions[index].module_permissions['can_delete'] == true || this.permissions[index].module_permissions['can_create'] == true) {
          this.permissions[index].module_permissions['can_list'] = true;
          this.permissions[index].module_permissions['can_view_details'] = true;
        } else {
          this.permissions[index].module_permissions['can_list'] = false;
          this.permissions[index].module_permissions['can_view_details'] = false;
        }
      }
    } else if (permissionName === 'can_list') {
      this.permissions[index].module_permissions[permissionName] = event.target.checked;
      if (event.target.checked === true) {
        this.permissions[index].module_permissions[permissionName] = event.target.checked;
      } else if (event.target.checked === false) {
        this.permissions[index].module_permissions['can_edit'] = false;
        this.permissions[index].module_permissions['can_view_details'] = false;
        this.permissions[index].module_permissions['can_delete'] = false;
        this.permissions[index].module_permissions['can_export'] = false;
        this.permissions[index].module_permissions['can_create'] = false;
      }
    } else if (permissionName === 'can_view_details') {
      this.permissions[index].module_permissions[permissionName] = event.target.checked;
      if (event.target.checked === true) {
        this.permissions[index].module_permissions['can_list'] = true;
      } else if (event.target.checked === false) {
        if (this.permissions[index].module_permissions['can_delete'] == true || this.permissions[index].module_permissions['can_create'] == true) {
          this.permissions[index].module_permissions['can_list'] = true;
        }else{
          this.permissions[index].module_permissions['can_list'] = false;
          this.permissions[index].module_permissions['can_edit'] = false;
        }
      }
    }

  }

  getRoleDetail(roleId: string) {
    this.loading = true;
    this.rolesService.getRole(roleId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.roleDetail = res.data;
        this.roleName = this.roleDetail.role_name;
        this.permissions = this.rolesService.getModuleAndPermissions();
        if (this.roleDetail.permissions.length > 0) {
          this.roleDetail.permissions.forEach(permissionDetail => {
            const permissionIndex = this.permissions.findIndex(x => x.module_name == permissionDetail.module_name);
            if (permissionIndex > -1) {
              this.permissions[permissionIndex] = permissionDetail;
            }
          })
        }
      },
      error: (errorRes: ErrorResponse) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          const message = this.translate.instant('Invalid Role Id')
          this.toastr.error(message);
          this.router.navigate(['/admin/roles']);
        }
      }
    });
  }

  //this funtion is used to open delete medel
  deleteRole() {
    const modalRef = this.modalService.open(DeleteRoleComponent, {
      windowClass: 'delete-role-modal'
    })
    modalRef.componentInstance.roleId = this.roleId;
    modalRef.result.then((isRoleDeleted) => {
      if (isRoleDeleted) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-role-modal'
        })
        modalRef.componentInstance.roleDeleted = true;
      }
    }).catch((error) => {
      if (error !== true && error !== 0) {
        const message = this.translate.instant('Something Went Wrong Please Try again later')
        this.toastr.error(message);
      }
    });
  }

  //change role status active to inactive, inactive to active
  changeStatus(event: any) {
    const modalRef = this.modalService.open(ActivateDeactivateRoleComponent, {
      windowClass: 'change-role-status-modal'
    })
    modalRef.componentInstance.roleId = this.roleId;
    modalRef.componentInstance.isActivate = event.target.checked;
    modalRef.result.then((isStatusChanged: boolean) => {
      if (isStatusChanged) {
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-role-modal'
        })
        modalRef.componentInstance.isRoleStatusChanged = true;
        modalRef.componentInstance.isRoleActivate = event.target.checked;

      } else {
        this.roleDetail.is_active = !event.target.checked;
      }
    }).catch((error) => {
      if (error !== true && error !== 0) {
        const message = this.translate.instant('Something Went Wrong Please Try again later')
        this.toastr.error(message);
      }
      this.roleDetail.is_active = !event.target.checked;
    });
  }

  formatRoleName(event: any) {
    let current: string = event.target.value;
    current = current.replace(/[^A-Za-z0-9 ]+/i, '');
    this.roleName = current;
  }

  addUpdateRole(): void {
    this.submitted = true;
    if (!this.roleName || this.roleName.trim() == '') {
      return;
    } else {
      let rolePermissions: any = {};
      let isAnyPermissionSelected = false;
      for (const permission of this.permissions) {
        if (!rolePermissions[permission.module_name]) {
          for (const name of this.permission_names) {
            if (permission.module_permissions[name]) {
              isAnyPermissionSelected = true;
              break;
            }
          }
          rolePermissions[permission.module_name] = permission.module_permissions;
        }
      }
      if (!isAnyPermissionSelected) {
        const message = this.translate.instant('Please select at least one permission!!')
        this.toastr.warning(message);
        return;
      }
      this.loading = true;
      const roleData: any = {
        role_name: this.roleName.trim(),
        permissions: rolePermissions
      };
      let addUpdateRole = this.rolesService.addRole(roleData);
      if (this.roleId) {
        roleData.role_id = this.roleId;
        addUpdateRole = this.rolesService.updateRole(roleData);
      }
      addUpdateRole.subscribe({
        next: (res: any) => {
          this.loading = false;
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'success-role-modal'
          })
          if (this.roleId) {
            modalRef.componentInstance.roleUpdated = true;
          } else {
            modalRef.componentInstance.roleAdded = true;
          }
        },
        error: (errorRes: ErrorResponse) => {
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
  }

  goBack() {
    this.location.back();
  }

}
