import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PaginationData } from '../../manage-experts/manage-experts.model';
import { DatePipe } from '@angular/common';
import { ActivityLogService } from '../activity-log.service';
import { Error } from 'src/app/shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserPermission, ModulePermissions, ModuleName } from '../../permission.model';

@Component({
  selector: 'app-activity-log-list',
  templateUrl: './activity-log-list.component.html',
  styleUrls: ['./activity-log-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ActivityLogListComponent implements OnInit {

  constructor(private datePipe: DatePipe, private translate: TranslateService, private activatedRoute: ActivatedRoute, private router: Router, private activityService: ActivityLogService, private toastr: ToastrService) {

    this.maxDate.setDate(this.maxDate.getDate() - 1);
  }

  searchText: string = '';
  allFilterParams: any = {}
  loading: boolean = false;
  page: any = 1;
  limit: any = 15;
  getScreenWidth: any;
  maxDate = new Date();
  selectedOperationType: any;
  selectedOperationId: any;
  operationType: any[] = [{ type: 'Create', id: 'create' },
  { type: 'Update', id: 'update' },
  { type: 'Delete', id: 'delete' }
  ]
  selectedModule: any;
  selectedModuleId: any
  module: any[] = [{ name: 'Vehicles', id: 'vehicles' }, { name: 'User Management', id: 'user_management' }, { name: 'Expert Review Management', id: 'expert_review_management' }]

  // [{ name: 'Dashboard', id: 'dashboard' },




  // { name: 'Activity Log Management', id: 'activity_log_management' },
  // { name: 'Vehicle Procedure', id: 'vehicle_procedure' },
  // ];
  selectedTab: any = 'all_user';
  selectedUserType: any;
  selectedUserTypeId: any;
  selectedDate: any[] = [];
  userType: any[] = [
    { id: 'buyer', type: 'Buyer' },
    { id: 'seller', type: 'Seller' },
    { id: 'dealer', type: 'Dealer' },
  ];
  roleType: any[] = [{ type: 'Super Admin', id: 'super_admin' },
  { type: 'Admin', id: 'admin' },
  { type: 'Expert', id: 'expert' },];
  selectedRoleType: any;
  selectedRoleTypeId: any;
  searchApplied: boolean = false;
  activityLogListData: any;
  sortBy: string = 'id';
  order: string = 'DESC';
  sortingOrder: boolean = true;

  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  paginationData: PaginationData = new PaginationData();
  ngOnInit(): void {
    this.allFilterParams = {}
    this.getScreenWidth = window.innerWidth;
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: UserPermission) => x.module_name == ModuleName.ActivityLog);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
    if (this.getScreenWidth < 768) {
      this.limit = 10;
      this.activityLogList({ page: this.page, limit: this.limit, type: this.selectedTab })
    } else {
      this.limit = 15;
      this.activityLogList({ page: this.page, limit: this.limit, type: this.selectedTab })
    }

  }

  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = this.page;
    this.activityLogList(this.allFilterParams)
  }

  setSearchText(keyword: string) {
    if(keyword && keyword.trim() != ''){
      this.allFilterParams.search = keyword;
      this.searchApplied = true
      this.activityLogList(this.allFilterParams)
    }
  }

  activityLogList(params: any) {
    this.loading = true;
    this.allFilterParams = params;
    //console.log('this.modulePermissions', this.modulePermissions);
    this.activityService.getActivityLogList(params).subscribe({
        next: (resp: any) => {
          this.activityLogListData = resp.data.items ? resp.data.items : [];
          this.paginationData = resp.data.pagination;
          this.loading = false;
          // for(let e of this.activityLogListData){
          //   this.dataObject.push(e.data)
          // }
          localStorage.setItem('updatedDetails', JSON.stringify(this.activityLogListData))
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
    })

  }

  selectValue(event: any, value: any, field: any) {
    if (field === 'operation_type') {
      this.selectedOperationId = event.target.value
      this.selectedOperationType = value
      this.searchApplied = false;
    } else if (field === 'module') {
      this.selectedModuleId = event.target.value
      this.selectedModule = value;
      this.searchApplied = false;
    } else if (field === 'user_type') {
      this.selectedUserTypeId = event.target.value;
      this.selectedUserType = value;
      this.searchApplied = false;
    } else if (field === 'role_type') {
      this.selectedRoleTypeId = event.target.value;
      this.selectedRoleType = value;
      this.searchApplied = false;
    }
  }

  updatedDetails(id: any) {
    this.router.navigate([`/admin/activity-log/updated-details/${id}`])
  }


  getFilterActivityLogList(date?: any) {
    if (this.selectedOperationType) {
      this.allFilterParams.operation_type = this.selectedOperationId
    } else if (this.selectedOperationType === null) {
      delete this.allFilterParams.operation_type;
    }

    if (date) {
      for (let i = 0; i < date.length; i++) {
        this.selectedDate.push(this.datePipe.transform(date[i], 'dd/MMM/YYYY'))
      }
      if (this.selectedDate.length > 0) {
        this.allFilterParams.from = this.datePipe.transform(this.selectedDate[0], 'dd/MM/YYYY');
        this.allFilterParams.to = this.datePipe.transform(this.selectedDate[1], 'dd/MM/YYYY');
      }
    } else if (this.selectedDate.length == 0) {
      delete this.allFilterParams.from
      delete this.allFilterParams.to
    }
    if (this.selectedModule) {
      this.allFilterParams.module = this.selectedModuleId;
    } else if (this.selectedModule === null) {
      delete this.allFilterParams.module
    }

    if (this.selectedTab === 'all_user') {
      if (this.selectedUserType) {
        this.allFilterParams.roles = this.selectedUserTypeId
      } else if (this.selectedUserType === null) {
        delete this.allFilterParams.roles
      }
    } else if (this.selectedTab === 'staff_member') {
      if (this.selectedRoleType) {
        this.allFilterParams.roles = this.selectedRoleTypeId;
      } else if (this.selectedRoleType === null) {
        delete this.allFilterParams.roles
      }
    }
    if (this.searchText) {
      this.allFilterParams.search = this.searchText
    } else if (this.searchText == '') {
      delete this.allFilterParams.search
    }

    if (this.selectedDate.length == 0 &&
      this.selectedRoleType == null &&
      this.selectedUserType == null &&
      this.selectedModule == null &&
      this.selectedOperationType == null &&
      this.searchText == '') {
      this.searchApplied = false;
    } else {
      this.searchApplied = true;
    }
    this.activityLogList(this.allFilterParams)
  }



  selectTab(tabName: any) {
    this.allFilterParams.type = tabName;
    this.selectedTab = tabName;

    if (tabName === 'all_user') {
      this.module = [{ name: 'Vehicles', id: 'vehicles' }, { name: 'User Management', id: 'user_management' }, { name: 'Expert Review Management', id: 'expert_review_management' },]
    } else if (tabName === 'staff_member') {
      this.module = [{ name: 'User Management', id: 'user_management' }, { name: 'Vehicles', id: 'vehicles' }, { name: 'Team Management', id: 'team_management' },
      { name: 'Expert Management', id: 'expert_management' }, { name: 'Expert Review Management', id: 'expert_review_management' },]
    }
    this.activityLogList(this.allFilterParams)
  }

  clearAll() {
    this.selectedModule = null
    this.selectedOperationType = null
    this.selectedRoleType = null
    this.selectedUserType = null
    this.searchText = ''
    // this.selectedModuleId = ''
    // this.selectedOperationId = ''
    // this.selectedRoleTypeId = ''
    // this.selectedUserTypeId = ''
    this.selectedDate = []
    this.searchApplied = false
    this.activityLogList({ page: this.page, limit: this.limit, type: this.selectedTab })
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sortBy != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.allFilterParams.sortBy = this.sortBy
    this.allFilterParams.sortOrder = this.order
    this.activityLogList(this.allFilterParams)
  }

}
