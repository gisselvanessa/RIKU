import { Component, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

import { Chart, registerables } from 'chart.js';

import { getBSConfig } from 'src/app/shared/helpers/date-helper';
import { Error } from 'src/app/shared/models/error.model';
import { OrderStats, Filters, OrderStatsAPIResponse, VehicleStatsAPIResponse } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-statistics',
  templateUrl: './vehicle-statistics.component.html',
  styleUrls: ['./vehicle-statistics.component.scss']
})

export class VehicleStatisticsComponent implements OnInit {

  filters = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];
  loading: boolean = false;
  vehicleStats: any;
  vehicleStatFilter: string = 'Today';
  bsRangeValue: Date[];
  startDate = new Date();
  endDate = new Date();
  today = new Date();
  selectedTab: string = 'all';


  @ViewChild('drp') dateRangePicker: any;
  bsConfig: BsDatepickerConfig;
  chart: any;
  date: any = new Date();
  orderStatFilter: string;
  month: any = this.date.getMonth();
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

  constructor(private dashboardService: DashboardService,
    private toastr: ToastrService, private translate: TranslateService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {

    this.bsRangeValue = [this.startDate, this.endDate];
    this.bsConfig = getBSConfig();
    this.onChangeFilter();
  }




  createChart(chartData: any = []) {
    let data: any,
      options: any,
      mychart: any = (document.getElementById('vehicleStatsChart') as HTMLElement);
    let labels: any = [];
    let vehiclesListed: any = [];
    let vehiclesSold: any = [];

    chartData.dates.forEach((item: any) => {
      //console.log('item.date', item.date);
      let date: any = new Date(item.date);
      // console.log('date', date);
      date = this.months[date.getMonth()] + ', ' + date.getDate();
      // console.log('date', date);
      labels.push(date);
      vehiclesListed.push(item.vehicle_listed);
      item.vehicle_sold = item.vehicle_sold ? item.vehicle_sold : 0;
      vehiclesSold.push(item.vehicle_sold);
    });

    const customTooltips = (context: any) => {
      // Tooltip Element
      const { chart, tooltip } = context;
      let tooltipEl: any = document.getElementById('chartjs-tooltip');
      if (tooltipEl) tooltipEl.remove();
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.style.maxWidth = '240px';
        tooltipEl.style.width = '100%';
        tooltipEl.style.boxShadow = '0px 3px 6px #00000029';
        tooltipEl.style.borderRadius = '6px';
        tooltipEl.style.zIndex = '2';
        let vehicleListed = tooltip.dataPoints.find((x: any) => x.dataset?.label == this.translate.instant('Total Vehicle Listed'));
        if (vehicleListed) {
          vehicleListed = vehicleListed.formattedValue;
        }
        let vehicleSold = tooltip.dataPoints.find((x: any) => x.dataset?.label == this.translate.instant('Total Vehicle Sold'));
        if (vehicleSold) {
          vehicleSold = vehicleSold.formattedValue;
        }

        tooltipEl.innerHTML = `<ul style="width:100%;padding: 8px 0;background:white">
                      <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px;line-height: 20px;">
                          <div class="title" style="display: flex;align-items: center;">
                              <span style="min-width:9px;min-height:9px;max-width:9px;max-height:9px;border-radius:50%;display:flex;margin-right: 4px;background-color: #E98D69;"></span>
                              <span style="font-size: 12px;color: #3B1144;font-weight: 500;"><span style="font-size: 12px;font-weight:600">`+ vehicleListed + `</span> `+ this.translate.instant('Vehicle Listed') + `</span>
                          </div>
                      </li>
                      <li style="display: flex;align-items: center;justify-content: space-between;padding: 0 10px;line-height: 20px;">
                          <div class="title" style="display: flex;align-items: center;">
                              <span style="min-width:9px;min-height:9px;max-width:9px;max-height:9px;border-radius:50%;display:flex;margin-right: 4px;background-color: #994C98;"></span>
                              <span style="font-size: 12px;color: #3B1144;font-weight: 500;"><span style="font-size: 12px;font-weight:600">`+ vehicleSold + `</span>`+ this.translate.instant('Vehicle Sold') + `</span>
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
      //  const bodyFont = this.chart.helpers.toFont(tooltipModel.options.bodyFont);
      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1;
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
      tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
      //  tooltipEl.style.font = bodyFont.string;
      tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
      tooltipEl.style.pointerEvents = 'none';
    };

    data = {
      datasets: [
        {
          label: this.translate.instant('Total Vehicle Listed'),
          // backgroundColor: '#f6d1c3',
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              // This case happens on initial chart load
              return;
            }
            return this.getGradient(ctx, chartArea, 'rgba(255, 255, 255, 0.7)', 'rgba(233, 141, 105, 0.7)');
          },
          borderColor: '#E98D69',
          data: vehiclesListed,
          fill: 'start',
          lineTension: 0.4,
          fillStyle: '#E98D69'
        },
        {
          label: this.translate.instant('Total Vehicle Sold'),
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              // This case happens on initial chart load
              return;
            }
            return this.getGradient(ctx, chartArea, 'rgba(255, 255, 255, 0.7)', 'rgba(153, 76, 152, 0.7)');
          },
          borderColor: '#994C98',
          data: vehiclesSold,
          fill: 'start',
          lineTension: 0.4,
          legend: {
            fillStyle: '#994C98'
          }
        }
      ],
      fill: true,
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
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: false,
          text: '',
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
      interaction: {
        mode: 'index'
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }
    if (mychart) {
      this.chart = new Chart(mychart, {
        type: 'line',
        data: data,
        options: options,
      });
    }
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


  onChangeFilter(filterName: string = '') {
    this.vehicleStatFilter = filterName;
    switch (filterName) {
      case Filters.Today: {
        this.startDate = new Date();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getVehicleStats(endDate, endDate);
        break;
      }
      case Filters.Yesterday: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 1))
        this.endDate = new Date(new Date().setDate(new Date().getDate() - 1))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.getVehicleStats(startDate, startDate);
        break;
      }
      case Filters.Last7Days: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 7))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getVehicleStats(startDate, endDate);
        break;
      }
      case Filters.Last30Days: {
        //statements;
        this.startDate = new Date(new Date().setDate(new Date().getDate() - 30))
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getVehicleStats(startDate, endDate);
        break;
      }
      case Filters.ThisMonth: {
        //statements;
        const date = new Date();
        this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date();
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getVehicleStats(startDate, endDate);
        break;
      }
      case Filters.LastMonth: {
        //statements;
        const date = new Date();
        this.startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
        this.endDate = new Date(date.getFullYear(), date.getMonth(), 0);
        const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
        this.getVehicleStats(startDate, endDate);
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
        this.getVehicleStats(endDate, endDate);
        break;
      }
    }
  }

  getDateValues(dates: any) {
    this.startDate = new Date(dates[0]);
    const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
    this.endDate = new Date(dates[1]);
    const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
    this.getVehicleStats(startDate, endDate);
  }

  getVehicleStats(startDate: string, endDate: string) {
    this.loading = true;
    const params: any = {
      start_date: startDate,
      end_date: endDate
    };
    if (this.selectedTab != 'all') {
      params['condition'] = this.selectedTab;
    }
    this.dashboardService.getVehicleStats(params).subscribe({
      next: (res: VehicleStatsAPIResponse) => {
        this.loading = false;
        this.vehicleStats = res.data;
        setTimeout(() => {
          this.createChart(this.vehicleStats);
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

  selectTab(tabName: string) {
    this.selectedTab = tabName;
    const startDate = ((this.startDate.getDate() > 9) ? this.startDate.getDate() : ('0' + this.startDate.getDate())) + '/' + ((this.startDate.getMonth() + 1) < 10 ? "0" + Number(this.startDate.getMonth() + 1) : this.startDate.getMonth() + 1) + '/' + this.startDate.getFullYear();
    const endDate = ((this.endDate.getDate() > 9) ? this.endDate.getDate() : ('0' + this.endDate.getDate())) + '/' + ((this.endDate.getMonth() + 1) < 10 ? "0" + Number(this.endDate.getMonth() + 1) : this.endDate.getMonth() + 1) + '/' + this.endDate.getFullYear();
    this.getVehicleStats(startDate, endDate);
  }

}
