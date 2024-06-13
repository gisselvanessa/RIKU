import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivateDeactivateComponent } from './activate-deactivate/activate-deactivate.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    NotificationComponent,
    ActivateDeactivateComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
    TranslateModule
  ]
})
export class NotificationsModule { }
