import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { DeleteCompanyComponent } from '../delete-company/delete-company.component';
import { CompaniesService } from '../companies.service';
import { PaginationData } from '../../admin-vehicles/models/vehicle.model';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { CompanyList, Company } from '../companies.model';
import { Error } from 'src/app/shared/models/error.model';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-comapany-list',
  templateUrl: './comapany-list.component.html',
  styleUrls: ['./comapany-list.component.scss']
})
export class ComapanyListComponent implements OnInit {

  // companyList and pagination variables
  companyList: Array<Company> = [];
  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();

  //loading variable
  loading: boolean = true;

  //filter variable
  isSearchApplied:boolean = false;
  sortBy: string = 'created_at';
  order: string = 'DESC';
  sortingOrder: boolean = true;
  searchText: string = '';
  updatedSearchText: string = '';
  allFilterParams: any = {};
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  constructor(
    private companiesService: CompaniesService,
    public router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private translate:TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //according the screen size getting the company list
    if (window.innerWidth < 768) {
      this.limit = 10;
      this.getAllCompanyList({ page: this.page, limit: this.limit, sortOrder: this.order, sortBy: this.sortBy });
    } else {
      this.limit = 15;
      this.getAllCompanyList({ page: this.page, limit: this.limit, sortOrder: this.order, sortBy: this.sortBy });
    }
    this.userRolePermission()
  }

  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'company_management')
    //     this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions;
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
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.CompanyManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  //this function is used to get companies list
  getAllCompanyList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.companiesService.getCompanyList(this.allFilterParams).subscribe({
      next: (res: CompanyList) => {
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
    url_param['sortOrder'] = this.order;
    url_param['sortBy'] = this.sortBy;
    this.getAllCompanyList(url_param);
  }

  //this function is used to set the sorting type
  setSorting(sortingBy: string = '') {
    this.sortingOrder = this.sortBy != sortingBy ? this.sortingOrder : !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterUserList();
  }

  //this funtion is used to open delete medel
  deleteCompany(id: string) {
    const modalRef = this.modalService.open(DeleteCompanyComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.companyId = id;
    modalRef.result.then((result: boolean) => {
      if (result) {
        //after getting the confirmation removing the dow from the list and after that success modal will open
        //using index and splice update original array
        const index = this.companyList.findIndex((x) => x.id == id);
        if (index > -1) {
          this.companyList.splice(index, 1);
        }
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'delete-vehicle-modal ',
        });
        modalRef.componentInstance.companyDeleted = true;
      }
    }).catch(() => { }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  //this function is used to
  public gotoCompanyDetail(companyData: Company) {
    localStorage.setItem(companyData.id, JSON.stringify(companyData));
    this.router.navigate(['/admin/companies/details', companyData.id]);
  }

  public searchTextChange(event: any) {
    this.isSearchApplied = false;
  }
}
