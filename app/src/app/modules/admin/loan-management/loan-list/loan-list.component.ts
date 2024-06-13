import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Error } from 'src/app/shared/models/error.model';
import { TranslateService } from '@ngx-translate/core';
import { PaginationData } from 'src/app/shared/models/pagination.model';
import { LoanService } from '../loan.service';
import { ModuleName, ModulePermissions } from '../../permission.model';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LoanListComponent implements OnInit{
  loading: boolean = true;
  page: number = 1;
  limit: number;
  getScreenWidth: any;
  active = 'all';
  paginationData: PaginationData = new PaginationData();
  loanList: Array<any> = [];
  sort_by: string = 'id';
  sort_order: string = 'DESC';
  sortingOrder: boolean = true;
  selectedTab = '';
  searchText: string = '';
  allFilterParams: any = {};
  modulePermissions: ModulePermissions;

  constructor(
    private adminUserService: LoanService,
    public router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 15;
    }
    this.userRolePermission();
    this.getAllUserList({ page: this.page, limit: this.limit, sort_by:this.sort_by, sort_order:this.sort_order });
  }

  userRolePermission() {
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.LoanManagement);
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

  getAllUserList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.adminUserService.getLoanList(this.allFilterParams).subscribe({
      next: (res: any) => {
        this.loanList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }

  getFilterUserList() {
    let url_param: any = {};
    if (this.searchText) {
      url_param['search'] = this.searchText;
    }
    if (this.selectedTab) {
      url_param['status'] = this.selectedTab
    }
    url_param['sort_order'] = this.sort_order;
    url_param['sort_by'] = this.sort_by;
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    this.getAllUserList(url_param);
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sort_by != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.sort_order = 'ASC' : this.sort_order = 'DESC';
    this.sort_by = sortingBy;
    this.getFilterUserList();
  }
}
