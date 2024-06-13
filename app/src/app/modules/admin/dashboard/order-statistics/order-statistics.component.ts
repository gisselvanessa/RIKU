import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { DashboardService } from '../dashboard.service';
import { Error } from 'src/app/shared/models/error.model';
import { OrderStats, OrderStatsAPIResponse, UserStats, UserStatsAPIResponse, Filters } from '../dashboard.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { getBSConfig } from 'src/app/shared/helpers/date-helper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-statistics',
  templateUrl: './order-statistics.component.html',
  styleUrls: ['./order-statistics.component.scss']
})


export class OrderStatisticsComponent implements OnInit {

  filters = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];
  loading: boolean = false;
  orderStats: OrderStats;
  orderStatFilter: string = 'Today';
  bsRangeValue: Date[];
  startDate = new Date();
  endDate = new Date();
  today = new Date();

  @ViewChild('drp') dateRangePicker: any;
  bsConfig: BsDatepickerConfig;

  constructor(private dashboardService: DashboardService,
    private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.bsRangeValue = [this.startDate, this.endDate];
    this.bsConfig = getBSConfig();
    this.onChangeFilter();
  }

  onChangeFilter(filterName: string = '') {
    this.orderStatFilter = filterName;
    switch (filterName) {
      case Filters.Today: {
        this.startDate = new Date();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getOrderStats(endDate, endDate);
        break;
      }
      case Filters.Yesterday: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 1))
        this.endDate = new Date(new Date().setDate(new Date().getDate() - 1))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.getOrderStats(startDate, startDate);
        break;
      }
      case Filters.Last7Days: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 7))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getOrderStats(startDate, endDate);
        break;
      }
      case Filters.Last30Days: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 30))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getOrderStats(startDate, endDate);
        break;
      }
      case Filters.ThisMonth: {
        //statements;
        const date = new Date();
        this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getOrderStats(startDate, endDate);
        break;
      }
      case Filters.LastMonth: {
        //statements;
        const date = new Date();
        this.startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date(date.getFullYear(), date.getMonth(), 0);
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getOrderStats(startDate, endDate);
        break;
      }
      case Filters.CustomRange: {
        //statements;
        this.dateRangePicker.toggle();
        break;
      }
      default: {
        //statements;
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getOrderStats(endDate, endDate);
        break;
      }
    }
  }

  getDateValues(dates: any) {
    this.startDate = new Date(dates[0]);
    const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
    this.endDate = new Date(dates[1]);
    const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
    this.getOrderStats(startDate, endDate);
  }

  getOrderStats(startDate: any, endDate: any) {
    this.loading = true;
    const params = {
      start_date: startDate,
      end_date: endDate
    };
    this.dashboardService.getOrderStats(params).subscribe({
      next: (res: OrderStatsAPIResponse) => {
        this.loading = false;
        this.orderStats = res.data;
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

}
