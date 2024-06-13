import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ModuleName, ModulePermissions } from '../../permission.model';
import { OrderDetail, OrderListResponse } from '../order.model';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  paginationData: any;
  loading: boolean = false;
  selectedTab: string = 'in_progress';
  orderList: Array<OrderDetail> = [];
  limit: number;
  page: number = 1;
  allFilterParams: any;
  searchApplied: boolean = false;
  searchText: string;
  modulePermissions: ModulePermissions;
  order: any = 'DESC';
  sortingOrder: boolean = true;
  sortBy: string = 'id';
  isPaid: boolean = false;
  searchKeyword: string = '';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private ordersService: OrdersService,
    private userService:UserService
  ) { }

  ngOnInit(): void {
    if (window.innerWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 15;
    }
    if (this.activatedRoute.snapshot.data['orders']['data']['items']) {
      this.orderList = this.activatedRoute.snapshot.data['orders']['data']['items'];
      this.paginationData = this.activatedRoute.snapshot.data['orders']['data']['pagination'];
    } else {
      this.getOrderList({ status: this.selectedTab.toUpperCase(), page: this.page, limit: this.limit });
    }
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.OrderManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }



  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    this.page = 1;
    this.limit = 15;
    this.getFilterOrderList();
  }

  setSearchText(keyword: string): void {
    if (keyword != '') {
      this.searchText = keyword;
      this.getFilterOrderList();
    } else {
      const message = this.translate.instant("Please enter keyword to search!!")
      this.toastr.warning(message);
    }
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterOrderList();
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.getFilterOrderList();
  }

  getOrderList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.ordersService.getOrderList(params).subscribe({
      next: (res: OrderListResponse) => {
        this.orderList = res.data.items ? res.data.items : [];
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

  getFilterOrderList() {
    let url_param: any = {};
    url_param['status'] = this.selectedTab.toUpperCase();
    if (this.searchText && this.searchText.trim() != '') {
      url_param['search'] = this.searchText;
      this.searchApplied = true;
    }
    url_param['order'] = this.order;
    url_param['order_by'] = this.sortBy;
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    this.getOrderList(url_param);
  }

  clearAll() {
    this.searchApplied = false;
    this.searchKeyword = '';
    this.allFilterParams = {};
    this.getOrderList({ status: this.selectedTab.toUpperCase(), page: 1, limit: this.limit });
  }


  onChangeStatus(status: string) {
    this.isPaid = status == 'pending' ? false : true;
  }

  updatePaymentStatus(index: number) {
    this.loading = true;
    this.ordersService.paymentToSeller({ order_id: this.orderList[index].id, is_paid: this.isPaid }).subscribe({
      next: (res: OrderListResponse) => {
        this.loading = false;
        this.orderList[index].is_paid = this.isPaid;
        this.toastr.success(this.translate.instant("Payment to seller has been updated successfully!!"));
        //trigger nitifications
        this.userService.updateNotificationList(true);
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
}
