import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { PaginationData } from '../../admin/admin-vehicles/models/vehicle.model';
import { AppointmentList } from '../apoointment.model';
import { ExpertsService } from '../experts.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {

  constructor(private expertService: ExpertsService, private toastr: ToastrService,
    private router:Router, private translate: TranslateService) { }

  loading: boolean = false;
  page: number = 1;
  limit: number;
  selectedTab = 'pending';
  getScreenWidth: any;
  sortBy: string = 'id';
  order: string = 'DESC';
  sortingOrder: boolean = true;
  allFilterParams: any = {};
  paginationData: PaginationData = new PaginationData();
  appointmentList: Array<AppointmentList>;

  ngOnInit(): void {
    if (window.innerWidth < 768) {
      this.limit = 10;
      this.getAllAppointments({ page: this.page, limit: this.limit, status: this.selectedTab, sort_order: this.order, sort_by: this.sortBy });
    } else {
      this.limit = 15;
      this.getAllAppointments({ page: this.page, limit: this.limit, status: this.selectedTab, sort_order: this.order, sort_by: this.sortBy });
    }
  }


  selectTab(tabName: string): void {
    this.selectedTab = tabName;
    this.page = 1;
    this.limit = 15;
    this.allFilterParams.status = this.selectedTab;
    this.getAllAppointments(this.allFilterParams)
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = page;
    this.getAllAppointments(this.allFilterParams);
  }

  scheduleMeeting(meetingStatus: any, id: any) {
    localStorage.setItem('typeOfMeeting', meetingStatus)
    setTimeout(() => {
      this.router.navigate([`/expert/schedule-appointment/${id}`])
    }, 1000);
  }

  viewAppointment(id: any) {
    this.router.navigate([`/expert/appointment-details/${id}`])
  }

  getAllAppointments(params: any) {
    this.allFilterParams = params;
    this.loading = true;
    this.expertService.getCompanyList(params).subscribe({
      next: (resp: any) => {
        this.appointmentList = resp.data.items ? resp.data.items : [];
        this.paginationData = resp.data.pagination;
        this.loading = false;
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    })
  }


  setSorting(sortingBy: string = '') {
    this.sortingOrder = !this.sortingOrder;
    this.sortingOrder = this.sortBy != sortingBy ? !this.sortingOrder : this.sortingOrder;
    this.sortingOrder ? this.order = 'ASC' : this.order = 'DESC';
    this.sortBy = sortingBy;
    this.allFilterParams.sort_by = this.sortBy
    this.allFilterParams.sort_order = this.order
    this.getAllAppointments(this.allFilterParams)
  }


}
