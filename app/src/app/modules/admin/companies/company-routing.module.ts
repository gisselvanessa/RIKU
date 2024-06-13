import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { ComapanyListComponent } from './comapany-list/comapany-list.component';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';

const routes: Routes = [
    {
        path:'',
        component: ComapanyListComponent,
        canActivate: [AdminAuthGuard]
    },
    {
        path:'add',
        component: AddCompanyComponent,
        canActivate: [AdminAuthGuard]
    },
    {
        path:'details/:id',
        component: CompanyDetailComponent,
        canActivate: [AdminAuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompaniesRoutingModule{ }
