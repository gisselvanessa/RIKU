import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginationData } from 'src/app/shared/models/pagination.model';
import { Blog } from '../blog.model';
import { BlogService } from '../blog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-blog',
  templateUrl: './list-blog.component.html',
  styleUrls: ['./list-blog.component.scss'],
})

export class ListBlogComponent implements OnInit {
  //filter variable
  sortBy: string = 'created_at';
  order: string = 'DESC';
  sortingOrder: boolean = true;
  searchText: string = '';

  blogList: Array<Blog> = [];
  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();

  allFilterParams: any = {};
  searchApplied: boolean = false;

  //loading variable
  loading: boolean = true;
  deletedBlogId: any;

  constructor(
    private router: Router,
    private blogService: BlogService,
    private toastr: ToastrService,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    //according the screen size getting the company list
    if (window.innerWidth < 768) {
      this.limit = 6;
      this.getAllBlogList({
        page: this.page,
        limit: this.limit,
        sortOrder: this.order,
        sortBy: this.sortBy,
      });
    } else {
      this.limit = 9;
      this.getAllBlogList({
        page: this.page,
        limit: this.limit,
        sortOrder: this.order,
        sortBy: this.sortBy,
      });
    }
  }

  editUser(id: any) {
    this.router.navigate([`/admin/blog/edit/${id}`]);
  }

  deleteBlog(index: any) {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    this.deletedBlogId = this.blogList[index].id;
    modalRef.componentInstance.blogId = this.blogList[index].id;
    modalRef.componentInstance.deleteSuccessBtnText = 'Back to Blog Listing';

    modalRef.result
      .then((result: boolean) => {
        if (result) {
          //after getting the confirmation removing the dow from the list and after that success modal will open
          //using index and splice update original array
          const indexBlog = this.blogList.findIndex(
            (x) => x.id == this.blogList[index].id
          );
          if (indexBlog > -1) {
            this.blogList.splice(indexBlog, 1);
          }
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-blog-modal',
          });
          modalRef.componentInstance.blogDeleted = true;
        }
      })
      .catch(() => {}); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.allFilterParams.page = page;
    this.getAllBlogList(this.allFilterParams);
  }

  getAllBlogList(params: any): void {
    this.loading = true;
    this.allFilterParams = params;
    this.blogService.getBlogList(this.allFilterParams).subscribe(
      (res: any) => {
        this.blogList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
      },
      ({ error, status }) => {
        this.loading = false;
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }

  // this function is used to get company list on the behalf on filter
  getFilterUserList(isFormSearchbutton: boolean = false) {
    let url_param: any = {};
    if (isFormSearchbutton) {
      this.page = 1;
    }
    url_param['page'] = this.page;
    url_param['limit'] = this.limit;
    url_param['sortOrder'] = this.order;
    url_param['sortBy'] = this.sortBy;
    this.getAllBlogList(url_param);
  }

  //this function is used to set the sorting type
  setSorting(sortingBy: string = '') {
    this.sortingOrder =
      this.sortBy != sortingBy ? this.sortingOrder : !this.sortingOrder;
    this.sortingOrder ? (this.order = 'ASC') : (this.order = 'DESC');
    this.sortBy = sortingBy;
    this.getFilterUserList();
  }

  onPaginationChange(isNextPage: boolean) {
    if (isNextPage) {
      this.nextPage();
    } else {
      this.previousPage();
    }
  }

  //this function is used to get data for previous page
  previousPage() {
    if (this.page > 1) {
      this.page = this.paginationData.current_page - 1;

      if (this.searchApplied) {
        // this.getFilterTeamMemberList()
      } else {
        this.getAllBlogList({ page: this.page, limit: this.limit });
      }
    }
  }

  //this function is used to get data for next page
  nextPage() {
    if (this.paginationData.current_page < this.paginationData.total_pages) {
      this.page = this.paginationData.current_page + 1;
      if (this.searchApplied) {
        // this.getFilterTeamMemberList()
      } else {
        this.getAllBlogList({ page: this.page, limit: this.limit });
      }
    }
  }

  isToggle(isBlogPublished:any){
    return typeof isBlogPublished === "boolean" ? true : false;
  }

  makePublish(id:string, event:any){
    let params: any = {};
    params.id = id;
  }

  embeddedUrl(url:any){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    let youtubeUrl = (match && match[2].length === 11)
      ? match[2]
      : null;
    return 'https://www.youtube.com/embed/' + youtubeUrl;
  }
}
