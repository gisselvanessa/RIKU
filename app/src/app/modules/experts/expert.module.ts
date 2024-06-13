import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ExpertRoutingModule } from './expert-routing.module';

import { AppointmentListComponent } from './appointment-list/appointment-list.component';

import { ScheduleAppointmentComponent } from './schedule-appointment/schedule-appointment.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';



@NgModule({
  declarations: [
    AppointmentListComponent,
    ScheduleAppointmentComponent,
    AppointmentDetailsComponent
  ],
  imports: [
    CommonModule,
    ExpertRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ExpertModule { }
