import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivateDeactivateComponent } from '../../admin-users/activate-deactivate/activate-deactivate.component';
import { PaginationData } from '../../admin-vehicles/models/vehicle.model';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { Company } from '../models/company.model';
import { Role } from '../models/role.model';
import { TeamMemberDetails } from '../models/team-member-model';
import { TeamMembersService } from '../team-members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

  constructor(public router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private modalService: NgbModal, private translate: TranslateService, private teamMembersService: TeamMembersService, private userService: UserService, private userPermissionService: UserPermissionService) { }

  teamMemberList: Array<TeamMemberDetails> = [];
  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();

  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;
  allFilterParams: any = {};

  getScreenWidth: any;
  deletedTeamMemberId: string;
  statusteamMemberId: string;
  selectedStatus: string;
  selectedStatusId: string;
  searchApplied: boolean = false;
  statusList = [{ id: 'ACTIVE', status: 'Active' },
  { id: 'INACTIVE', status: 'Inactive' }];
  //loading variable
  loading: boolean = true;

  //filter variable
  sortBy: string = 'CREATED_DATE';
  order: string = 'DESC';
  sortingOrder: boolean = true;
  searchText: string = '';

  roleList: Array<Role> = [];
  selectedRole: Array<string> = [];
  selectedRoleId: Array<string> = [];
  companyList: Array<Company> = [];
  selectedCompany: Array<string> = [];
  selectedCompanyId: Array<string> = [];


  ngOnInit(): void {
    this.dropDownList()
    //according the screen size getting the company list
    if (window.innerWidth < 768) {
      this.limit = 10;
      this.getAllTeamMembersList({ page: this.page, limit: this.limit, sortOrder: this.order, sortBy: this.sortBy });
    } else {
      this.limit = 15;
      this.getAllTeamMembersList({ page: this.page, limit: this.limit, sortOrder: this.order, sortBy: this.sortBy });
    }
    this.teamMembersService.getDeletedTeamMember.subscribe((isDeleted: boolean) => {
      if (isDeleted) {
        const deleteTeamMemberIndex = this.teamMemberList.findIndex((x: any) => x.user_id == this.deletedTeamMemberId
        )
        if (deleteTeamMemberIndex > -1) {
          this.teamMemberList.splice(deleteTeamMemberIndex, 1);
        }
      }

    })
    this.userRolePermission()
  }
  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'team_management')
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
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.TeamManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  dropDownList() {
    forkJoin([this.teamMembersService.getCompanyList(), this.teamMembersService.getRoleList()]).pipe(map(([companyList, roleList]) => {
      this.companyList = companyList.data;
      this.roleList = roleList.data;
    })).subscribe()
  }

  getFilterTeamMemberList() {
    this.loading = true;
    let url_param: any = {};
    if (this.selectedRoleId.length > 0) {
      url_param['companyRole'] = this.selectedRoleId
    }

    if (this.selectedCompanyId.length > 0) {
      url_param['company'] = this.selectedCompanyId
    }

    if (this.selectedStatusId) {
      url_param['status'] = this.selectedStatusId
    }
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    url_param['sortOrder'] = this.order;
    url_param['sortBy'] = this.sortBy;
    if (this.searchText) {
      url_param['search'] = this.searchText;
    }
    this.getAllTeamMembersList(url_param);

    if (this.selectedCompanyId.length === 0) {
      if (this.selectedRoleId.length === 0) {
        if (!this.selectedStatusId) {
          if (!this.searchText) {
            this.searchApplied = false;
          } else {
            this.searchApplied = true
          }
        } else {
          this.searchApplied = true
        }
      } else {
        this.searchApplied = true
      }
    } else {
      this.searchApplied = true;
    }
  }

  getAllTeamMembersList(params: any): void {
    this.allFilterParams = params;
    this.teamMembersService.getTeamMember(this.allFilterParams).subscribe((res: any) => {
      this.teamMemberList = res.data.items ? res.data.items : [];
      this.paginationData = res.data.pagination;
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

  //this function is called if pagination changed

  //this function is called if pagination changed
  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = page;
    if (this.searchApplied) {
      this.getAllTeamMembersList(this.allFilterParams);
    } else {
      this.getAllTeamMembersList({ page: this.page, limit: this.limit, sortOrder: this.order, sortBy: this.sortBy })
    }
  }

  onPaginationChange(isNextPage: boolean) {
    if (isNextPage) {
      this.nextPage();
    } else {
      this.previousPage();
    }
  }

  //this function is used to get data for previous page
  previousPage() {
    if (this.page > 1) {
      this.page = this.paginationData.current_page - 1;

      if (this.searchApplied) {
        this.getFilterTeamMemberList()
      } else {
        this.getAllTeamMembersList({ page: this.page, limit: this.limit })
      }

    }
  }

  //this function is used to get data for next page
  nextPage() {
    if (this.paginationData.current_page < this.paginationData.total_pages) {
      this.page = this.paginationData.current_page + 1;
      if (this.searchApplied) {
        this.getFilterTeamMemberList()
      } else {
        this.getAllTeamMembersList({ page: this.page, limit: this.limit })
      }
    }
  }

  editUser(userId: any) {
    this.router.navigate([`/admin/team-members/edit-members/${userId}`])
  }

  deleteUser(index: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    this.deletedTeamMemberId = this.teamMemberList[index].user_id;
    modalRef.componentInstance.teamMemberId = this.teamMemberList[index].user_id;

    const message = this.translate.instant('Back to Team Listing')
    modalRef.componentInstance.deleteSuccessBtnText = message;

  }


  changeStatus(event: any, i: any) {
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    this.statusteamMemberId = this.teamMemberList[i].user_id;
    modalRef.componentInstance.teamMemberId = this.teamMemberList[i].user_id;
    const message = this.translate.instant('Back to Team Listing')
    modalRef.componentInstance.changeSuccessBtnText = message;
    modalRef.componentInstance.statusTeamMember = this.teamMemberList[i].status
    modalRef.componentInstance.active = event.target.checked;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'cancel' || resp === 0) {
        event.target.checked = !event.target.checked;
        this.teamMemberList[i].status = event.target.checked ? 'Active' : 'Inactive';
      } else if (resp === 'confirm') {
        this.teamMemberList[i].status = event.target.checked ? 'Active' : 'Inactive';
      }
    })
  }

  selectValue(event: any, field: string, name: any) {
    if (field == 'status') {
      if (event.target.checked) {
        this.selectedStatusId = event.target.value
        this.selectedStatus = name
      }
      this.searchApplied = false;


    }

    if (field == 'role') {
      if (event.target.checked) {
        if (this.selectedRoleId.indexOf(event.target.value) < 0) {
          this.selectedRoleId.push(event.target.value);
          this.selectedRole.push(name);
        }
      } else {
        if (this.selectedRoleId.indexOf(event.target.value) > -1) {
          const index = this.selectedRoleId.indexOf(event.target.value);
          this.selectedRoleId.splice(index, 1);
          const nameIndex = this.selectedRole.indexOf(name);
          this.selectedRole.splice(nameIndex, 1);
        }
      }
      this.searchApplied = false;
    }
    if (field == 'company') {
      if (event.target.checked) {
        if (this.selectedCompanyId.indexOf(event.target.value) < 0) {
          this.selectedCompanyId.push(event.target.value);
          this.selectedCompany.push(name);
        }
      } else {
        if (this.selectedCompanyId.indexOf(event.target.value) > -1) {
          const index = this.selectedCompanyId.indexOf(event.target.value);
          this.selectedCompanyId.splice(index, 1);
          const nameIndex = this.selectedCompany.indexOf(name);
          this.selectedCompany.splice(nameIndex, 1);
        }
      }
      this.searchApplied = false;
    }
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sortBy != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterTeamMemberList();
  }

  clearAll() {
    this.page = 1;
    this.selectedStatus = '';
    this.selectedCompany = [];
    this.selectedCompanyId = [];
    this.selectedRole = [];
    this.selectedRoleId = [];
    this.selectedStatusId = '';
    this.searchText = '';
    this.getFilterTeamMemberList();
    this.searchApplied = false;
  }

  removeRole(role: string) {
    const selectedRole = this.roleList.find((x: any) => x.name == role)
    if (selectedRole && selectedRole.uuid) {
      this.selectedRoleId.splice(this.selectedRoleId.indexOf(selectedRole.uuid), 1);
      this.selectedRole.splice(this.selectedRole.indexOf(role), 1);
      this.getFilterTeamMemberList();
    }

  }
  removeCompany(company: string) {
    const selectedCompany = this.companyList.find((x: any) => x.name == company)
    if (selectedCompany && selectedCompany.uuid) {
      this.selectedCompanyId.splice(this.selectedCompanyId.indexOf(selectedCompany.uuid), 1);
      this.selectedCompany.splice(this.selectedCompany.indexOf(company), 1);
      this.getFilterTeamMemberList();
    }

  }

  removeStatus() {
    this.selectedStatusId = '';
    this.selectedStatus = '';
    this.getFilterTeamMemberList();

  }
}
