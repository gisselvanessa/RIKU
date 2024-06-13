import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { FaqService } from '../faq.service';
import { PaginationData } from 'src/app/shared/models/pagination.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  accordianOpen = false;
  selectAccordian = '';
  removePaddingButtom = true;

  faqList: any = [];
  page: number = 1;
  limit: number;
  paginationData: PaginationData = new PaginationData();

  loading = false;
  isDataLoaded = false;
  isSearch: string = '';
  isSearchApplied = false;

  constructor(
    private faqService: FaqService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    //according the screen size getting the company list
    this.onScreensize();
  }

  selectedAccordians(sectionValue: any) {
    const currentAccordian = sectionValue;
    this.accordianOpen = this.selectAccordian !== currentAccordian ? true : false;
    this.selectAccordian = this.accordianOpen ? sectionValue : '';
  }

  //this function is used to get companies list
  getAllFAQList(params: any): void {
    this.loading = true;
    if (this.isSearch) params.search = this.isSearch;
    this.faqService.getFAQList(params).subscribe({
      next: (res: any) => {
        this.faqList = res.data.items ? res.data.items : [];
        this.paginationData = res.data.pagination;
        this.loading = false;
        if (this.isSearchApplied && this.faqList?.length) {
          const sectionValue = this.faqList[0].uuid;
          setTimeout(() => {
            this.selectedAccordians(sectionValue);
          }, 500)
        }
        this.isDataLoaded = true;
      },
      error: (errorRes: Error) => {
        this.isDataLoaded = true;
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {

          this.toastr.error(this.translate.instant("Something Went Wrong Please Try again later"));
        }
      }
    });
  }


  onSearch() {
    this.isSearchApplied = this.isSearch.length ? true : false;
    this.loading = true;
    this.page = 1;
    this.onScreensize();
  }

  onScreensize() {
    if (window.innerWidth < 768) {
      this.limit = 10;
      this.getAllFAQList({ page: this.page, limit: this.limit });
    } else {
      this.limit = 15;
      this.getAllFAQList({ page: this.page, limit: this.limit });
    }
  }

  //this function is called if pagination changed
  jumpToThePage(page: number) {
    this.page = page;
    this.onScreensize();
  }

}
