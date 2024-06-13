import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { Error } from 'src/app/shared/models/error.model';
import { PaginationData } from 'src/app/shared/models/pagination.model';
import { FaqService } from '../faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  faqList: any = [];
  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();
  allFilterParams: any = {};
  removePaddingButtom = true;
  accordianOpen = false;
  selectAccordian = '';

  loading = true;
  isSearch = ''

  constructor(
    private faqService:FaqService,
    private toastr:ToastrService,
    private router:Router,
    private modalService: NgbModal,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    //according the screen size getting the company list
    this.onScreensize();
  }

  //this function is used to get companies list
  getAllFAQList(params: any): void {
    this.allFilterParams = params;
    if(this.isSearch) params.search = this.isSearch;
    this.faqService.getFAQList(this.allFilterParams).subscribe({
      next: (res: any) => {
        this.faqList = res?.data?.items?.length ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
        
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
    });
  }

  onSearch(){
    this.onScreensize();
  }

  onScreensize(){
    if (window.innerWidth < 768) {
      this.limit = 10;
      this.getAllFAQList({ page: this.page, limit: this.limit });
    } else {
      this.limit = 15;
      this.getAllFAQList({ page: this.page, limit: this.limit });
    }
  }


  //this function is called if pagination changed
  jumpToThePage(page:number){
    this.page = page;
    this.allFilterParams.page = page;
    this.loading = true;
    this.getAllFAQList( this.allFilterParams);
  }

  editFaq(id: any) {
    this.router.navigate([`/admin/faq/edit/${id}`]);
  }

  deletefaq(index:any){
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    modalRef.componentInstance.faqId = this.faqList[index].uuid;
    modalRef.result.then((result: boolean) => {
      if (result) {
        //after getting the confirmation removing the dow from the list and after that success modal will open
        //using index and splice update original array
        const indexBlog = this.faqList.findIndex((x:any) => x.uuid == this.faqList[index].uuid);
        if (indexBlog > -1) {
          this.faqList.splice(indexBlog, 1);
        }
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'delete-blog-modal',
        });
        modalRef.componentInstance.faqDeleted = true;
        const message = this.translate.instant("Back to FAQ Listing")
        modalRef.componentInstance.deleteSuccessBtnText = message;
      }
    })
    .catch(() => {}); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  selectedAccordians(sectionValue: any) {
    const currentAccordian = sectionValue;
    this.accordianOpen = this.selectAccordian !== currentAccordian ? true : false;
    this.selectAccordian = this.accordianOpen ? sectionValue : '';
  }
}
