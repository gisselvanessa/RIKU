import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { ModuleName, ModulePermissions } from '../../permission.model';
import { Error } from 'src/app/shared/models/error.model';
import { ActivateDeactivateComponent } from '../../admin-users/activate-deactivate/activate-deactivate.component';
import { ManageExpertsService } from '../manage-experts.service';
import { ExpertUserDetails, GetExpertListResponse, PaginationData } from '../manage-experts.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-expert-list',
  templateUrl: './expert-list.component.html',
  styleUrls: ['./expert-list.component.scss']
})

export class ExpertListComponent implements OnInit {
  loading: boolean = true;
  page: number = 1;
  limit: number;
  deletedExpertId: string;
  isEnableNext: boolean = false;
  getScreenWidth: number;
  selectedStatus: string | null;
  searchApplied: boolean = false;
  active = 'all';
  statusList = [{ id: 'ACTIVE', status: 'Active' },
  { id: 'INACTIVE', status: 'Inactive' }];
  paginationData: PaginationData = new PaginationData();
  sortBy: string = 'CREATED_DATE';
  order: string = 'DESC';
  sortingOrder: boolean = true;
  selectedTab = 'all';
  searchText: string = '';
  modulePermissions: ModulePermissions = {} as ModulePermissions;
  allFilterParams: any = {};
  searchKeyword: string = '';
  expertList: Array<ExpertUserDetails> = [];
  constructor(
    public router: Router, private translate: TranslateService, private toastr: ToastrService, private activatedRoute: ActivatedRoute,
    private modalService: NgbModal, private expertsService: ManageExpertsService
  ) {
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.ExpertManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 20;
    }

    this.expertsService.getDeletedExpert.subscribe((isDeleted: boolean) => {
      if (isDeleted) {
        const deleteExpertIndex = this.expertList.findIndex((x: any) => x.id == this.deletedExpertId
        )
        if (deleteExpertIndex > -1) {
          this.expertList.splice(deleteExpertIndex, 1);
        }
      }
    })
    // let userSearchParam: any = localStorage.getItem('userSearchParams');
    // if(userSearchParam){
    //   userSearchParam = JSON.parse(userSearchParam);
    //   if(userSearchParam.page){
    //     this.page = userSearchParam.page;
    //   }
    //   if(userSearchParam.limit){
    //     this.limit = userSearchParam.limit;
    //   }
    //   if(userSearchParam.search){
    //     this.searchApplied = true;
    //     this.searchText = userSearchParam.search;
    //   }
    //   if(userSearchParam.sortBy){
    //     this.searchApplied = true;
    //     this.sortBy = userSearchParam.sortBy;
    //   }
    //   if(userSearchParam.sortOrder){
    //     this.searchApplied = true;
    //     this.order = userSearchParam.sortOrder;
    //   }
    //   if(userSearchParam.statusRole){
    //     this.searchApplied = true;
    //     this.selectedStatus = userSearchParam.statusRole;
    //   }
    //   if(userSearchParam.userType){
    //     this.searchApplied = true;
    //     this.selectedTab = userSearchParam.userType;
    //   }
    //   this.getExperList(userSearchParam);
    // }else{
    //   this.getExperList({ page: this.page, limit: this.limit });
    // }
    this.getExperList({ page: this.page, limit: this.limit });
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    this.page = 1;
    this.limit = this.limit;
    this.getFilterExperList();
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = page;
    this.getExperList(this.allFilterParams);
  }


  changeStatus(event: any, i: any) {
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.expertId = this.expertList[i].id;
    const message = this.translate.instant("Back to Expert Listing")
    modalRef.componentInstance.changeSuccessBtnText = message;
    modalRef.componentInstance.expertStatus = this.expertList[i].is_active
    modalRef.componentInstance.active = event.target.checked;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'cancel' || resp === 0) {
        event.target.checked = !event.target.checked;
        this.expertList[i].is_active = event.target.checked ? true : false;
      } else if (resp === 'confirm') {
        this.expertList[i].is_active = event.target.checked ? true : false;
      }
    })
  }

  setSearchText(keyword: string): void {
    if (keyword != '') {
      this.searchText = keyword;
      this.getFilterExperList();
    } else {
      const message = this.translate.instant("Please enter keyword to search!!")
      this.toastr.warning(message);
    }
  }

  getFilterExperList() {
    let url_param: any = {};
    if (this.searchText && this.searchText.trim() != '') {
      url_param['search'] = this.searchText;
      this.searchApplied = true;
    }
    url_param['sortOrder'] = this.order;
    url_param['sortBy'] = this.sortBy;
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    this.getExperList(url_param);
  }

  getExperList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.loading = true;
    this.allFilterParams = params;
    this.expertsService.getExpertList(params).subscribe({
      next: (res: GetExpertListResponse) => {
        this.expertList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
    });
  }


  selectValue(value: any, field: string) {
    if (field == 'status') {
      this.selectedStatus = value;
    }
  }

  clearAll() {
    this.selectedStatus = null;
    this.searchText = '';
    this.searchKeyword = '';
    this.page = 1;
    this.searchApplied = false;
    this.getFilterExperList();
  }

  editUser(userId: any) {
    this.router.navigate([`/admin/experts/edit/${userId}`])
  }

  deleteUser(index: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    this.deletedExpertId = this.expertList[index].id;
    modalRef.componentInstance.expertId = this.expertList[index].id;
    const message = this.translate.instant("Back to Expert Listing")
    modalRef.componentInstance.deleteSuccessBtnText = message;
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sortBy != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterExperList();
  }

  ngOnDestroy() {
    // localStorage.removeItem('userSearchParams');
  }

}
