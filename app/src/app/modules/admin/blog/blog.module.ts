import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from 'src/app/app.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { ListBlogComponent } from './list-blog/list-blog.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';

import { ActivateDeactivateComponent } from './activate-deactivate/activate-deactivate.component';


@NgModule({
  declarations: [
    AddBlogComponent,
    ListBlogComponent,
    BlogDetailsComponent,
    EditBlogComponent,
    ActivateDeactivateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BlogRoutingModule,
    SharedModule,
    CKEditorModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ]
})
export class BlogModule { }
