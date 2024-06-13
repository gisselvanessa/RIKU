import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { ContactUsListing } from '../contact-us.model';
import { ContactUsService } from '../contact-us.service';
import { ActivatedRoute } from '@angular/router';
import { UserPermission, ModuleName, ModulePermissions } from '../../permission.model';

@Component({
  selector: 'app-contact-us-listing',
  templateUrl: './contact-us-listing.component.html',
  styleUrls: ['./contact-us-listing.component.scss']
})
export class ContactUsListingComponent implements OnInit {
  paginationData: any;
  loading: boolean = false;
  selectedTab: string = 'open';
  manageContactUsList: Array<ContactUsListing> = [];
  page: any = 1;
  limit: any = 15;
  getScreenWidth: any;
  searchApplied: boolean = false;
  allFilterParams: any = {}
  modulePermissions: ModulePermissions;
  order: any = 'ASC';
  sortingOrder: boolean = true;
  sortBy: string = 'id';
  isPaid: boolean = false;
  searchKeyword: string = '';
  constructor(private toastr: ToastrService, private activatedRoute: ActivatedRoute, private translate: TranslateService, private contactUsService: ContactUsService) { }

  ngOnInit(): void {
    this.allFilterParams = {}
    this.getScreenWidth = window.innerWidth;
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: UserPermission) => x.module_name == ModuleName.ContactUs);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
    if (this.getScreenWidth < 768) {
      this.limit = 10;
      this.contactUsList({ page: this.page, limit: this.limit, status: this.selectedTab })
    } else {
      this.limit = 15;
      this.contactUsList({ page: this.page, limit: this.limit, status: this.selectedTab })
    }
  }


  setSearchText(keyword: string) {
    if (keyword && keyword.trim() != '') {
      this.allFilterParams.search = keyword;
      this.searchApplied = true
      this.contactUsList(this.allFilterParams)
    } else {
      const message = this.translate.instant("Please enter keyword to search!!")
      this.toastr.warning(message);
    }
  }

  contactUsList(params: any) {
    this.loading = true;
    this.allFilterParams = params;
    this.contactUsService.getContactUsList(params).subscribe({
      next: (resp: any) => {
        this.manageContactUsList = resp.data.items ? resp.data.items : [];
        this.paginationData = resp.data.pagination;
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
    })
  }





  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sortBy != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.allFilterParams.sortBy = this.sortBy
    this.allFilterParams.sortOrder = this.order
    this.contactUsList(this.allFilterParams)
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = this.page;
    this.contactUsList(this.allFilterParams)
  }
  selectTab(tabName: string): void {
    this.allFilterParams.status = tabName;
    this.selectedTab = tabName;
    this.contactUsList(this.allFilterParams);
  }



  clearAll() {
    this.searchKeyword = '';
    this.searchApplied = false
    this.contactUsList({ page: this.page, limit: this.limit, status: this.selectedTab })
  }

}
