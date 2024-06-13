import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ModulePermissions, UserPermission } from '../../permission.model';
import { TeamMemberDetails } from '../models/team-member-model';
import { TeamMembersService } from '../team-members.service';

@Component({
  selector: 'app-team-member-details',
  templateUrl: './team-member-details.component.html',
  styleUrls: ['./team-member-details.component.scss']
})
export class TeamMemberDetailsComponent implements OnInit {

  constructor(private teamMemberService: TeamMembersService, private userService: UserService, private userPermissionService: UserPermissionService, private router: Router, private activateRoute: ActivatedRoute, private location: Location) { }

  teamMemberId: string;
  teamMemberDetails: TeamMemberDetails;
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  ngOnInit(): void {
    this.teamMemberId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.teamMemberService.getTeamMemberDeatils(this.teamMemberId).subscribe((resp: any) => {
      this.teamMemberDetails = resp.data;
    })
    this.userRolePermission()
  }
  userRolePermission() {
    if (this.userService.getUserType() === 'admin') {
      this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
        this.permissionModule = resp.data.permissions
        const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'team_management')
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
  goback() {
    this.location.back()
  }

  editUser() {
    this.router.navigate([`admin/team-members/edit-members/${this.teamMemberId}`])
  }
}
