import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ListBlogComponent } from './list-blog/list-blog.component';

const routes: Routes = [
  { path: '', component: ListBlogComponent},
  { path: ':id', component: BlogDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
