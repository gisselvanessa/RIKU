import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminUsersRoutingModule } from './admin-users-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUsersComponent } from './add-users/add-users.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { EditUsersComponent } from './edit-users/edit-users.component';
import { ActivateDeactivateComponent } from './activate-deactivate/activate-deactivate.component';
import { AdmniUserDetailsComponent } from './user-details/user-details.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    UsersListComponent,
    AddUsersComponent,
    EditUsersComponent,
    ActivateDeactivateComponent,
    AdmniUserDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminUsersRoutingModule,
    ShareButtonsModule,
    SwiperModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class AdminUsersModule { }
