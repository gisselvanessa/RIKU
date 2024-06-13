import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from "ngx-toastr";

import { APIResponse, ErrorResponse, Permission, Role, RoleListResponse } from '../role.model';
import { RolesService } from '../roles.service';
import { map, mergeMap } from 'rxjs';
import { TeamMemberDetails } from '../../team-members/models/team-member-model';
import { ModulePermissions, UserPermission } from '../../permission.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {

  roleId: string | undefined;
  roleDetail: Role = new Role();
  permissions: Array<any> = [];
  roleName: string;
  loading: boolean = false;
  membersLoading: boolean = false;
  submitted: boolean = false;
  teamMembers: Array<TeamMemberDetails> = [];
  permission_names: Array<string> = ['can_list', 'can_view_details', 'can_create', 'can_edit', 'can_delete', 'can_export'];
  sortBy: string = 'FIRST_NAME';
  order: string = 'ASC';
  sortingOrder: boolean = true;
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  constructor(private activatedRoute: ActivatedRoute, private rolesService: RolesService, private toastr: ToastrService,
    private router: Router, private userService: UserService,
    private userPermissionService: UserPermissionService, private translate:TranslateService) { }

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
    this.permissions[index].module_permissions[permissionName] = event.target.checked;
  }

  getRoleDetail(roleId: string) {
    this.loading = true;
    this.rolesService.getRole(roleId)
      .pipe()
      .subscribe((res: APIResponse) => {
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
        this.getTeamMembersList();
      }, (errorRes: ErrorResponse) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          const message = this.translate.instant('Invalid Role Id')
          this.toastr.error(message);
          this.router.navigate(['/admin/roles']);
        }
      })
  }

  getTeamMembersList() {
    this.membersLoading = true;
    const params: any = {};
    params['sortOrder'] = this.order;
    params['sortBy'] = this.sortBy;
    this.rolesService.getTeamMembersByRole(`companyRole[0]=${this.roleId}`, params).
      pipe().
      subscribe((teamMembersRes: any) => {
        this.membersLoading = false;
        this.teamMembers = teamMembersRes.data.items ? teamMembersRes.data.items : [];
      }, (errorRes: ErrorResponse) => {
        this.membersLoading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          const message = this.translate.instant('Invalid Role Id')
          this.toastr.error(message);
          this.router.navigate(['/admin/roles']);
        }
      })
  }

  //this function is used to set the sorting type
  setSorting(sortingBy: string = '') {
    this.sortingOrder = this.sortBy != sortingBy ? this.sortingOrder : !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getTeamMembersList();
  }

}
