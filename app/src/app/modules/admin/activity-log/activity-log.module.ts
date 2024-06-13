import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityLogRoutingModule } from './activity-log-routing.module';
import { ActivityLogListComponent } from './activity-log-list/activity-log-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdatedDataComponent } from './updated-data/updated-data.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ActivityLogListComponent,
    UpdatedDataComponent
  ],
  imports: [
    CommonModule,
    ActivityLogRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class ActivityLogModule { }
