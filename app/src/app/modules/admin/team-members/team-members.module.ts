import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamMembersRoutingModule } from './team-members-routing.module';
import { AddMembersComponent } from './add-members/add-members.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SharedModule } from 'src/app/shared/shared.module';
import { MembersListComponent } from './members-list/members-list.component';
import { TeamMemberDetailsComponent } from './team-member-details/team-member-details.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AddMembersComponent,
    MembersListComponent,
    TeamMemberDetailsComponent
  ],
  imports: [
    CommonModule,
    TeamMembersRoutingModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    FormsModule,
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class TeamMembersModule { }
