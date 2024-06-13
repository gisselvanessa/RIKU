import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { RoleListComponent } from './role-list/role-list.component';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { DeleteRoleComponent } from './delete-role-dialog/delete-role.component';
import { ActivateDeactivateRoleComponent } from './activate-deactivate-role-dialog/activate-deactivate-role.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { httpTranslateLoader } from 'src/app/app.module';
//import { ModulePermissoinComponent } from './add-edit-role/module-permissions/module-permissions.component';

@NgModule({
  declarations: [
    RoleListComponent,
    AddEditRoleComponent,
    RoleDetailsComponent,
    DeleteRoleComponent,
    ActivateDeactivateRoleComponent,
    // ModulePermissoinComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RolesRoutingModule,
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
export class RolesModule { }
