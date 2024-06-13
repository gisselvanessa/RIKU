import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { getBSConfig } from 'src/app/shared/helpers/date-helper';

import { DealerDashboardService } from '../dealer-dashboard.service';
import { Filters, OrderStatsAPIResponse } from 'src/app/modules/admin/dashboard/dashboard.model';
import { DealerVehiclesService } from '../../dealer-vehicles/dealer-vehicles.service';

import { Error } from 'src/app/shared/models/error.model';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-and-recent-vehicles',
  templateUrl: './customer-and-recent-vehicles.component.html',
  styleUrls: ['./customer-and-recent-vehicles.component.scss']
})

export class CustomerAndRecentVehiclesComponent implements OnInit {

  filters = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];
  loading: boolean = false;
  customerStatFilter: string = 'Today';
  bsRangeValue: Date[];
  earningStartDate = new Date();
  earningEndDate = new Date();
  startDate = new Date();
  endDate = new Date();
  selectedTab: string = 'all';

  @ViewChild('drp') dateRangePicker: any;
  @ViewChild('odrp') orderDateRangePicker: any;
  bsConfig: BsDatepickerConfig;
  totalEarnings: any;
  customerStats: any;
  chart: any;
  gradient: any;
  width: any;
  height: any;
  date: any = new Date();
  today = new Date();
  month: any = this.date.getMonth();
  dateWiseData: any = [];
  months: any = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  vehicleList: any = [];
  sortBy: string = 'id';
  order: any = 'DESC';
  sortingOrder: boolean = true;
  loadingCustomerStats: boolean = false;
  deletedVehicleId:string;

  constructor(private dashboardService: DealerDashboardService,
    private vehicleService: AddVehicleService,
    private toastr: ToastrService, private dealerVehiclesService: DealerVehiclesService,
    private modalService: NgbModal, private translate: TranslateService) {
  }


  ngOnInit(): void {
    this.bsRangeValue = [this.earningStartDate, this.earningEndDate];
    this.bsConfig = getBSConfig();
    this.onChangeFilter();
    this.getFilterVehicleList();
    this.vehicleService.getDeleteVehicle.subscribe((isDeleted) => {
      if (isDeleted) {
        const deleteVehicleIndex = this.vehicleList.findIndex(
          (x: any) => x.id == this.deletedVehicleId
        );
        if (deleteVehicleIndex > -1) {
          this.vehicleList.splice(deleteVehicleIndex, 1);
        }
      }
    });
  }

  onChangeFilter(filterName: string = '') {
    this.customerStatFilter = filterName;
    switch (filterName) {
      case Filters.Today: {
        this.startDate = new Date();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getCustomerStats(endDate, endDate);
        break;
      }
      case Filters.Yesterday: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 1))
        this.endDate = new Date(new Date().setDate(new Date().getDate() - 1))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.getCustomerStats(startDate, startDate);
        break;
      }
      case Filters.Last7Days: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 7))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getCustomerStats(startDate, endDate);
        break;
      }
      case Filters.Last30Days: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 30))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getCustomerStats(startDate, endDate);
        break;
      }
      case Filters.ThisMonth: {
        //statements;
        const date = new Date();
        this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getCustomerStats(startDate, endDate);
        break;
      }
      case Filters.LastMonth: {
        //statements;
        const date = new Date();
        this.startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date(date.getFullYear(), date.getMonth(), 0);
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getCustomerStats(startDate, endDate);
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
        this.getCustomerStats(endDate, endDate);
        break;
      }
    }
  }

  getDateValues(dates: any) {
    this.startDate = new Date(dates[0]);
    const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
    this.endDate = new Date(dates[1]);
    const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
    this.getCustomerStats(startDate, endDate);
  }

  getCustomerStats(startDate: any, endDate: any) {
    this.loadingCustomerStats = true;
    const params = {
      start_date: startDate,
      end_date: endDate
    };
    this.dashboardService.getCustomerStats(params).subscribe({
      next: (res: OrderStatsAPIResponse) => {
        this.loadingCustomerStats = false;
        this.customerStats = res.data;
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

  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.getFilterVehicleList();
  }

  getFilterVehicleList(order?: any, provience?: any, user_province?: any) {
    if (order) {
      this.order = order;
    }
    const url_param: any = {};
    if (this.selectedTab != 'all') {
      url_param['condition'] = this.selectedTab;
    }
    url_param['order'] = this.order;
    url_param['order_by'] = this.sortBy;
    url_param['page'] = 1;
    url_param['limit'] = 10;
    this.getRecentlyAddedVehicles(url_param);
  }

  getRecentlyAddedVehicles(params: any): void {
    this.loading = true;
    this.dealerVehiclesService.getAllVehicle(params).subscribe(
      (res: any) => {
        this.vehicleList = res.data.items;
        this.loading = false;
      },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
    this.getFilterVehicleList();
  }

  deleteVehicle(vehicleId: string){
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    this.deletedVehicleId = vehicleId;
    modalRef.componentInstance.vehicleId = vehicleId;
    modalRef.componentInstance.isFromDealer = true;
    modalRef.componentInstance.deleteSuccessBtnText = this.translate.instant('Back to Dashboard');
    modalRef.result.then((isVehicleDeleted: boolean) => {
      if (isVehicleDeleted) {
        const vehicleIndex = this.vehicleList.findIndex((x: any) => x.uuid == vehicleId);
        if (vehicleIndex > -1) {
          this.vehicleList.splice(vehicleIndex, 1);
        }
        this.toastr.success(this.translate.instant('Vehicle deleted successfuly!!'));
      }
    });
  }
}
