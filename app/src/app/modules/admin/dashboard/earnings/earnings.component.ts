import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';

import { getBSConfig } from 'src/app/shared/helpers/date-helper';
import { Error } from 'src/app/shared/models/error.model';
import { OrderStats, Filters, OrderStatsAPIResponse, EarningStatsAPIResponse } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})

export class EarningsComponent implements OnInit, AfterViewInit {
  filters = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];
  loading: boolean = false;
  earningStatFilter: string = 'Today';
  bsRangeValue: Date[];
  earningStartDate = new Date();
  earningEndDate = new Date();
  startDate = new Date();
  endDate = new Date();
  today = new Date();
  selectedTab: string = 'all';

  @ViewChild('drp') dateRangePicker: any;
  @ViewChild('odrp') orderDateRangePicker: any;
  bsConfig: BsDatepickerConfig;
  totalEarnings: any;
  orderStats: OrderStats;
  chart: any;
  gradient: any;
  width: any;
  height: any;
  date: any = new Date();
  orderStatFilter: string;
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
  // jsonOptions = {
  //   "menuOptions": [
  //       {
  //           "item": "Y Axis",
  //           "checkMark": true
  //       },
  //       {
  //           "item": "X Axis Labels",
  //           "checkMark": true
  //       },
  //       {
  //           "item": "X Axis Grid Lines",
  //           "checkMark": true
  //       },{
  //           "lineOptions": [
  //               {
  //                   "value": 7,
  //                   "percent": 14.28
  //               },
  //               {
  //                   "value": 10,
  //                   "percent": 10
  //               },
  //               {
  //                   "value": 15,
  //                   "percent": 6.67
  //               },
  //               {
  //                   "value": 20,
  //                   "percent": 5
  //               }
  //           ]
  //       }
  //   ]
  // };

  // data = {
  //   "chartData": [
  //     {
  //       "line": [10, 50, 25, 70, 40, 10, 90, 67, 88, 112, 115, 120]
  //     },
  //     {
  //       "line": [20, 30, 25, 35, 40, 64, 65, 67, 75, 100, 100, 100]
  //     }
  //   ]
  // }

  constructor(private dashboardService: DashboardService,
    private toastr: ToastrService, private translate: TranslateService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.bsRangeValue = [this.earningStartDate, this.earningEndDate];
    this.bsConfig = getBSConfig();
    this.onChangeEarningFilter();
    this.onChangeFilter();
  }

  ngAfterViewInit() {
  }

  getGradient(ctx: any, chartArea: any, bottomColor: string, topColor: string) {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    let gradient, width, height;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, bottomColor);
      gradient.addColorStop(1, topColor);
    }
    return gradient;
  }

  createChart(chartData: any = []) {
    let data: any,
      options: any,
      ctx: any = document.getElementById('lineChart') as HTMLElement;
    let labels: any = [];
    let earnings: any = [];
    chartData.forEach((item: any) => {
      let date: any = new Date(item.date);
      date = this.months[date.getMonth()] + ', ' + date.getDate();
      labels.push(date);
      earnings.push(item.total);
      this.dateWiseData.push(
        { 'date': item.date, label: date, dateDetail: item }
      )
    });

    const customTooltips = (context: any) => {
      const { chart, tooltip } = context;
      const data = this.dateWiseData.find((x: any) => x.label == tooltip.title[0]);
      let totalEarnings = data.dateDetail.total;
      let totalOrderEarnings = 0;
      let totalExpertEarnings = 0;
      let earningViaCard = 0;
      let earningViaCash = 0;
      let earningViaBank = 0;

      if (data.dateDetail.order) {
        if (data.dateDetail.order.via_card) {
          totalOrderEarnings += Number(data.dateDetail.order.via_card);
          earningViaCard += Number(data.dateDetail.order.via_card);
        }
        if (data.dateDetail.order.via_cash) {
          totalOrderEarnings += Number(data.dateDetail.order.via_cash);
          earningViaCash += Number(data.dateDetail.order.via_cash);
        }
        if (data.dateDetail.order.via_bank) {
          totalOrderEarnings += Number(data.dateDetail.order.via_bank);
          earningViaBank += Number(data.dateDetail.order.via_bank);
        }
      }

      if (data.dateDetail.expert_review) {
        if (data.dateDetail.expert_review.via_card) {
          totalExpertEarnings += Number(data.dateDetail.expert_review.via_card);
          earningViaCard += Number(data.dateDetail.expert_review.via_card);
        }
        if (data.dateDetail.expert_review.via_cash) {
          totalExpertEarnings += Number(data.dateDetail.expert_review.via_cash);
          earningViaCash += Number(data.dateDetail.expert_review.via_cash);
        }
        if (data.dateDetail.expert_review.via_bank) {
          totalExpertEarnings += Number(data.dateDetail.expert_review.via_bank);
          earningViaBank += Number(data.dateDetail.expert_review.via_bank);
        }
      }
      let tooltipEl: any = document.getElementById('chartjs-earnings-tooltip');
      if (tooltipEl) tooltipEl.remove();
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-earnings-tooltip';
        tooltipEl.style.maxWidth = '240px';
        tooltipEl.style.width = '100%';
        tooltipEl.style.boxShadow = '0px 3px 6px #00000029';
        tooltipEl.style.borderRadius = '6px';
        tooltipEl.style.zIndex = '2';
        tooltipEl.innerHTML = `<ul style="width:100%;padding: 8px 0;background:white;">
        <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px;line-height: 20px;">
          <div class="title" style="display: flex;align-items: center;">
            <span style="font-size: 10px;color: #3B1144;font-weight: 500;">`+ this.translate.instant('Total Earnings')+`</span>
          </div>
          <div class="price">
            <p style="color: #E98D69;font-size: 12px;font-weight: 600;">$`+ totalEarnings + `</p>
          </div>
        </li>
        <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px;line-height: 20px;">
          <div class="title" style="display: flex;align-items: center;">
            <span
              style="min-width:6px;min-height:6px;max-width:6px;max-height:6px;border-radius:50%;display:flex;margin-right: 4px;background-color: #E98D69;"></span>
            <span style="font-size: 10px;color: #3B1144;font-weight: 500;">`+ this.translate.instant('Earnings by Orders') +`</span>
          </div>
          <div class="price">
            <p style="color: #E98D69;font-size: 12px;font-weight: 600;">$`+ totalOrderEarnings + `</p>
          </div>
        </li>
        <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px;line-height: 20px;">
          <div class="title" style="display: flex;align-items: center;">
            <span
              style="min-width:6px;min-height:6px;max-width:6px;max-height:6px;border-radius:50%;display:flex;margin-right: 4px;background-color: #994C98;"></span>
            <span style="font-size: 10px;color: #3B1144;font-weight: 500;">`+ this.translate.instant('Earnings by Expert Review') +`</span>
          </div>
          <div class="price">
            <p style="color: #994C98;font-size: 12px;font-weight: 600;">$`+ totalExpertEarnings + `</p>
          </div>
        </li>
        <li style="background-color: #9D88A1;opacity: 0.5;box-shadow: 0px 3px 6px #00000029;height: 0.5px;margin: 5px 0;">
        </li>
        <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px 5px;line-height: 20px;">
          <div class="title" style="display: flex;align-items: center;">
            <span style="font-size: 10px;color: #B1A0B4;font-weight: 500;">`+ this.translate.instant('Payment received via cash') +`</span>
          </div>
          <div class="price">
            <p style="color:#3B1144;font-size: 12px;font-weight: 600;">$`+ earningViaCash + `</p>
          </div>
        </li>
        <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px 5px;line-height: 20px;">
          <div class="title" style="display: flex;align-items: center;">
            <span style="font-size: 10px;color: #B1A0B4;font-weight: 500;">`+ this.translate.instant('Payment received via card') +`</span>
          </div>
          <div class="price">
            <p style="color:#3B1144;font-size: 12px;font-weight: 600;">$`+ earningViaCard + `</p>
          </div>
        </li>
        <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px 5px;line-height: 20px;">
          <div class="title" style="display: flex;align-items: center;">
            <span style="font-size: 10px;color: #B1A0B4;font-weight: 500;">Payment received via Bank transfer</span>
          </div>
          <div class="price">
            <p style="color:#3B1144;font-size: 12px;font-weight: 600;">$`+ earningViaBank + `</p>
          </div>
        </li>
      </ul>`;
        this.chart.canvas.parentNode.appendChild(tooltipEl);
      }
      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0 as any;
        return;
      }
      // Set caret Position
      tooltipEl.classList.remove('above', 'below', 'no-transform');
      if (tooltip.yAlign) {
        tooltipEl.classList.add(tooltip.yAlign);
      } else {
        tooltipEl.classList.add('no-transform');
      }
      const tooltipModel = context.tooltip;
      const position = context.chart.canvas.getBoundingClientRect();
      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
      tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
      tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
      tooltipEl.style.pointerEvents = 'none';
    };

    data = {
      datasets: [
        {
          label: 'Earnings',
          // backgroundColor: '#a1cce3',
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              // This case happens on initial chart load
              return;
            }
            return this.getGradient(ctx, chartArea, 'rgba(255, 255, 255, 0.7)', 'rgba(47, 119, 156, 0.7)');
          },
          borderColor: '#2F779C',
          data: earnings,
          fill: true,
          lineTension: 0.4,
          pointBorderColor: 'white',
          pointBorderWidth: 7,
          pointRadius: 10,
          pointStyle: 'circle',
          pointBackgroundColor: '#2F779C'
        }
      ],
      fill: true, // Change this to true, add rgba(...) in datasets background color
    };
    data.labels = labels;

    options = {
      maintainAspectRatio: false, // Enables custom canvas dimension
      responsive: true,
      layout: {
        padding: {
          top: 20,
          right: 20,
          left: 20,
          bottom: 0,
        },
      },
      title: {
        display: false,
        text: '',
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false,
          mode: 'index',
          position: 'nearest',
          backgroundColor: 'white',
          titleColor: '#3B1144',
          external: customTooltips
        }
      },
      scales: {
        x: {
          gridLines: {
            display: false
          }
        },
        y: {
          ticks: {
            callback: (value: any, index: any, ticks: any) => {
              return '$' + value;
            }
          },
          gridLines: {
            display: false
          },
        }
      },
    };
    if (this.chart) {
      this.chart.destroy();
    }
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
      });
    }

  }

  onChangeEarningFilter(filterName: string = '') {
    this.earningStatFilter = filterName;
    switch (filterName) {
      case Filters.Today: {
        this.earningStartDate = new Date();
        this.earningEndDate = new Date();
        const endDate = ((this.earningEndDate.getDate() > 9) ? this.earningEndDate.getDate() : ('0' + this.earningEndDate.getDate())) + '/' + ((this.earningEndDate.getMonth() + 1) < 10 ? "0" + Number(this.earningEndDate.getMonth() + 1) : this.earningEndDate.getMonth() + 1) + '/' + this.earningEndDate.getFullYear();
        this.getTotalEarnings(endDate, endDate);
        break;
      }
      case Filters.Yesterday: {
        //statements;
        this.earningStartDate = new Date(new Date().setDate(new Date().getDate() - 1))
        this.earningEndDate = new Date(new Date().setDate(new Date().getDate() - 1))
        const startDate = ((this.earningStartDate.getDate() > 9) ? this.earningStartDate.getDate() : ('0' + this.earningStartDate.getDate())) + '/' + ((this.earningStartDate.getMonth() + 1) < 10 ? "0" + Number(this.earningStartDate.getMonth() + 1) : this.earningStartDate.getMonth() + 1) + '/' + this.earningStartDate.getFullYear();
        this.getTotalEarnings(startDate, startDate);
        break;
      }
      case Filters.Last7Days: {
        //statements;
        this.earningStartDate = new Date(new Date().setDate(new Date().getDate() - 7))
        const startDate = ((this.earningStartDate.getDate() > 9) ? this.earningStartDate.getDate() : ('0' + this.earningStartDate.getDate())) + '/' + ((this.earningStartDate.getMonth() + 1) < 10 ? "0" + Number(this.earningStartDate.getMonth() + 1) : this.earningStartDate.getMonth() + 1) + '/' + this.earningStartDate.getFullYear();
        this.earningEndDate = new Date();
        const endDate = ((this.earningEndDate.getDate() > 9) ? this.earningEndDate.getDate() : ('0' + this.earningEndDate.getDate())) + '/' + ((this.earningEndDate.getMonth() + 1) < 10 ? "0" + Number(this.earningEndDate.getMonth() + 1) : this.earningEndDate.getMonth() + 1) + '/' + this.earningEndDate.getFullYear();
        this.getTotalEarnings(startDate, endDate);
        break;
      }
      case Filters.Last30Days: {
        //statements;
        this.earningStartDate = new Date(new Date().setDate(new Date().getDate() - 30))
        const startDate = ((this.earningStartDate.getDate() > 9) ? this.earningStartDate.getDate() : ('0' + this.earningStartDate.getDate())) + '/' + ((this.earningStartDate.getMonth() + 1) < 10 ? "0" + Number(this.earningStartDate.getMonth() + 1) : this.earningStartDate.getMonth() + 1) + '/' + this.earningStartDate.getFullYear();
        this.earningEndDate = new Date();
        const endDate = ((this.earningEndDate.getDate() > 9) ? this.earningEndDate.getDate() : ('0' + this.earningEndDate.getDate())) + '/' + ((this.earningEndDate.getMonth() + 1) < 10 ? "0" + Number(this.earningEndDate.getMonth() + 1) : this.earningEndDate.getMonth() + 1) + '/' + this.earningEndDate.getFullYear();
        this.getTotalEarnings(startDate, endDate);
        break;
      }
      case Filters.ThisMonth: {
        //statements;
        const date = new Date();
        this.earningStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDate = ((this.earningStartDate.getDate() > 9) ? this.earningStartDate.getDate() : ('0' + this.earningStartDate.getDate())) + '/' + ((this.earningStartDate.getMonth() + 1) < 10 ? "0" + Number(this.earningStartDate.getMonth() + 1) : this.earningStartDate.getMonth() + 1) + '/' + this.earningStartDate.getFullYear();
        this.earningEndDate = new Date();
        const endDate = ((this.earningEndDate.getDate() > 9) ? this.earningEndDate.getDate() : ('0' + this.earningEndDate.getDate())) + '/' + ((this.earningEndDate.getMonth() + 1) < 10 ? "0" + Number(this.earningEndDate.getMonth() + 1) : this.earningEndDate.getMonth() + 1) + '/' + this.earningEndDate.getFullYear();
        this.getTotalEarnings(startDate, endDate);
        break;
      }
      case Filters.LastMonth: {
        //statements;
        const date = new Date();
        this.earningStartDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const startDate = ((this.earningStartDate.getDate() > 9) ? this.earningStartDate.getDate() : ('0' + this.earningStartDate.getDate())) + '/' + ((this.earningStartDate.getMonth() + 1) < 10 ? "0" + Number(this.earningStartDate.getMonth() + 1) : this.earningStartDate.getMonth() + 1) + '/' + this.earningStartDate.getFullYear();
        this.earningEndDate = new Date(date.getFullYear(), date.getMonth(), 0);
        const endDate = ((this.earningEndDate.getDate() > 9) ? this.earningEndDate.getDate() : ('0' + this.earningEndDate.getDate())) + '/' + ((this.earningEndDate.getMonth() + 1) < 10 ? "0" + Number(this.earningEndDate.getMonth() + 1) : this.earningEndDate.getMonth() + 1) + '/' + this.earningEndDate.getFullYear();
        this.getTotalEarnings(startDate, endDate);
        break;
      }
      case Filters.CustomRange: {
        //statements;
        this.dateRangePicker.toggle();
        break;
      }
      default: {
        //statements;
        this.earningEndDate = new Date();
        const endDate = ((this.earningEndDate.getDate() > 9) ? this.earningEndDate.getDate() : ('0' + this.earningEndDate.getDate())) + '/' + ((this.earningEndDate.getMonth() + 1) < 10 ? "0" + Number(this.earningEndDate.getMonth() + 1) : this.earningEndDate.getMonth() + 1) + '/' + this.earningEndDate.getFullYear();
        this.getTotalEarnings(endDate, endDate);
        break;
      }
    }
  }

  getEarningDateValues(dates: any) {
    this.earningStartDate = new Date(dates[0]);
    const startDate = ((this.earningStartDate.getDate() > 9) ? this.earningStartDate.getDate() : ('0' + this.earningStartDate.getDate())) + '/' + ((this.earningStartDate.getMonth() + 1) < 10 ? "0" + Number(this.earningStartDate.getMonth() + 1) : this.earningStartDate.getMonth() + 1) + '/' + this.earningStartDate.getFullYear();
    this.earningEndDate = new Date(dates[1]);
    const endDate = ((this.earningEndDate.getDate() > 9) ? this.earningEndDate.getDate() : ('0' + this.earningEndDate.getDate())) + '/' + ((this.earningEndDate.getMonth() + 1) < 10 ? "0" + Number(this.earningEndDate.getMonth() + 1) : this.earningEndDate.getMonth() + 1) + '/' + this.earningEndDate.getFullYear();
    this.getTotalEarnings(startDate, endDate);
  }

  getTotalEarnings(startDate: any, endDate: any) {
    this.loading = true;
    const params = {
      start_date: startDate,
      end_date: endDate
    };
    this.dashboardService.getTotalEarnings(params).subscribe({
      next: (res: EarningStatsAPIResponse) => {
        this.loading = false;
        this.totalEarnings = res.data;
        setTimeout(() => {
          this.createChart(this.totalEarnings);
        }, 1000);
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
        this.orderDateRangePicker.toggle();
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
