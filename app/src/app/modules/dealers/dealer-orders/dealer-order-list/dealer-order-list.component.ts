import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { Order, OrderListResponse } from '../dealer-order.model';
import { DealerOrdersService } from '../dealer-orders.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dealer-order-list',
  templateUrl: './dealer-order-list.component.html',
  styleUrls: ['./dealer-order-list.component.scss']
})
export class DealerOrderListComponent implements OnInit {

  paginationData: any;
  loading: boolean = false;
  selectedTab: string = 'in_progress';
  orderList: Array<any> = [];
  limit: number;
  page: number = 1;
  sortingOrder: boolean;
  order: string;
  sortBy: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private toastr: ToastrService, private translate: TranslateService,
    private dealerOrdersService: DealerOrdersService) { }


  ngOnInit(): void {
    if (window.innerWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 20;
    }
    if (this.activatedRoute.snapshot.data['orders']['data']['items']) {
      this.orderList = this.activatedRoute.snapshot.data['orders']['data']['items'];
      this.paginationData = this.activatedRoute.snapshot.data['orders']['data']['pagination'];
    } else {
      this.getOrderList({ status : this.selectedTab.toUpperCase(), page: this.page, limit: this.limit});
    }
  }

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterOrderList();
  }

  getFilterOrderList() {
    let url_param: any = {};
    url_param['status'] = this.selectedTab.toUpperCase();
    url_param['order'] = this.order ? this.order : 'DESC';
    url_param['order_by'] = this.sortBy ? this.sortBy : 'id';
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    this.getOrderList(url_param);
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    this.getFilterOrderList();
  }

  jumpToThePage(page: any): void {
    this.page = page;
    this.getFilterOrderList();
  }

  getOrderList(params: any): void {
    this.loading = true;
    this.dealerOrdersService.getOrderList(params).subscribe({
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
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });

  }

}
