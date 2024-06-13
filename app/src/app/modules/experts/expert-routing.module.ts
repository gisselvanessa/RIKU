import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { ScheduleAppointmentComponent } from './schedule-appointment/schedule-appointment.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'appointments',
    pathMatch: 'full',
  },
  {
    path: 'appointments',
    component: AppointmentListComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'schedule-appointment/:id',
    component: ScheduleAppointmentComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'appointment-details/:id',
    component: AppointmentDetailsComponent,
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'appraisal-report',
    loadChildren: () =>
      import('./appraisal-report/appraisal-report.module').then((m) => m.AppraisalReportModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertRoutingModule { }
