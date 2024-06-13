import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { DashboardService } from '../dashboard.service';
import { Error } from 'src/app/shared/models/error.model';
import { UserStats, UserStatsAPIResponse } from '../dashboard.model';
import { ModulePermissions } from '../../permission.model';
import { ModulePermission } from '../../roles/role.model';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-total-user-registrations',
  templateUrl: './total-user-registrations.component.html',
  styleUrls: ['./total-user-registrations.component.scss']
})


export class TotalUserRegistrationsComponent implements OnInit {

  loading: boolean = false;
  userStats: UserStats;
  constructor(private dashboardService: DashboardService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit(): void {
    this.getUserStats();
  }

  getUserStats() {
    this.loading = true;
    let startDate: any = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    startDate = ((startDate.getDate() > 9) ? startDate.getDate() : ('0' + startDate.getDate())) + '/' + ((startDate.getMonth() + 1) < 10 ? "0" + Number(startDate.getMonth() + 1) : startDate.getMonth() + 1) + '/' + startDate.getFullYear();
    let endDate: any = new Date();
    endDate = ((endDate.getDate() > 9) ? endDate.getDate() : ('0' + endDate.getDate())) + '/' + ((endDate.getMonth() + 1) < 10 ? "0" + Number(endDate.getMonth() + 1) : endDate.getMonth() + 1) + '/' + endDate.getFullYear();
    const params = {
      start_date: startDate,
      end_date: endDate
    };
    this.dashboardService.getUserStats(params).subscribe({
      next: (res: UserStatsAPIResponse) => {
        this.loading = false;
        this.userStats = res.data;
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
