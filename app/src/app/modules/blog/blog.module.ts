import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';
import { ListBlogComponent } from './list-blog/list-blog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ListBlogComponent,
    BlogDetailsComponent,
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    SwiperModule,
    TranslateModule
  ]
})
export class BlogModule { }
