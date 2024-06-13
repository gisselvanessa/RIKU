import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { EditFaqComponent } from './edit-faq/edit-faq.component';
const routes: Routes = [
  {
    path: '',
    component: FaqComponent
  },
  {
    path: 'add',
    component: AddFaqComponent
  },
  {
    path: 'edit/:id',
    component: EditFaqComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FqaRoutingModule { }
