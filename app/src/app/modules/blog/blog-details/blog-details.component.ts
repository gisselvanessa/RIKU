import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../blog.model';
import { BlogService } from '../blog.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class BlogDetailsComponent implements OnInit {

  blogId: string;
  blogDetails: Blog;
  loading = true;
  relatedBlogList: any;
  sortBy: string = 'created_at';
  order: string = 'DESC';
  page: number = 1;
  limit: number = 5;
  swiperReview: any = {
    breakpoints: {
      '0': {
        slidesPerView: 1,
      },
      '576': {
        slidesPerView: 2,
      },
      '991': {
        slidesPerView: 3,
      }
    },
    loop: false,
  }

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private blogService: BlogService,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private toastr:ToastrService,
    private translate: TranslateService
  ) {
    /* when we reload page with different route then its only relaod but ngoninit() not called again
    * due to component is not initialized again. this code helps to do that.
    */

   this.router.routeReuseStrategy.shouldReuseRoute = () => {
     return false;
   };
  }

  ngOnInit(): void {
    this.blogId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.blogService.getBlogDetails(this.blogId).subscribe((resp: any) => {
      this.loading = false;
      this.blogDetails = resp.data;
      const tags = resp.data?.tags?.length ? [...resp.data.tags] : [];
      this.getAllBlogList({
        page: this.page,
        limit: this.limit,
        sortOrder: this.order,
        sortBy: this.sortBy,
        tag: tags,
        current_blog_id : this.blogId
      });
    },
    ({ error, status }) => {
      this.loading = false;
      if (error) {
        this.toastr.error(error.error[0]);
      } else {
        this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
      }
      this.router.navigate(['/blogs']);
    })
  }

  goback() {
    this.location.back()
  }

  editBlog() {
    this.router.navigate([`admin/blog/edit/${this.blogId}`])
  }

  embeddedUrl(url:any){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    let youtubeUrl = (match && match[2].length === 11)
      ? match[2]
      : null;
    return 'https://www.youtube.com/embed/' + youtubeUrl;
  }

  getAllBlogList(params: any): void {
    this.blogService.getBlogList(params).subscribe(
      (res: any) => {
        this.relatedBlogList = res.data.items ? res.data.items : [];
        // this.swiperReview = {
        //   breakpoints: {
        //     '0': {
        //       slidesPerView: 1,
        //     },
        //     '576': {
        //       slidesPerView: this.relatedBlogList?.length > 2 ? 2 : 1,
        //     },
        //     '991': {
        //       slidesPerView: this.relatedBlogList?.length > 3 ? 3 : this.relatedBlogList?.length,
        //     }
        //   },
        //   loop: true,
        // }
      },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        }
      }
    );
  }
}
