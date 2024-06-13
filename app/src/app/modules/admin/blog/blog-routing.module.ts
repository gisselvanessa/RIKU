import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from 'src/app/guards/admin.guard';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { ListBlogComponent } from './list-blog/list-blog.component';

const routes: Routes = [
  { path: '', redirectTo: 'blog-list', pathMatch: 'full' },
  { path: 'blog-list', component: ListBlogComponent, canActivate: [AdminAuthGuard] },
  { path: 'add', component: AddBlogComponent, canActivate: [AdminAuthGuard] },
  { path: 'edit/:id', component: EditBlogComponent, canActivate: [AdminAuthGuard] },
  { path: 'blog-details/:id', component: BlogDetailsComponent, canActivate: [AdminAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
