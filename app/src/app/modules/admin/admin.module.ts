import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';

import { AdminVehiclesModule } from './admin-vehicles/admin-vehicles.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { TeamMembersModule } from './team-members/team-members.module';
import { RolesModule } from './roles/roles.module';
import { ManageExpertsModule } from './manage-experts/manage-experts.module';
import { EditProfileComponent } from './manage-profile/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './manage-profile/view-profile/view-profile.component';
import { SharedModule } from "../../shared/shared.module";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BlogModule } from './blog/blog.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AdminLoginComponent,
    EditProfileComponent,
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    AdminRoutingModule,
    AdminVehiclesModule,
    AdminUsersModule,
    TeamMembersModule,
    RolesModule,
    ManageExpertsModule,
    SharedModule,
    CKEditorModule,
    BlogModule,
    TranslateModule
  ]
})
export class AdminModule { }
