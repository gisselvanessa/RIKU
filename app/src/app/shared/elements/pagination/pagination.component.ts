import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PaginationData } from "src/app/modules/admin/admin-vehicles/models/vehicle.model";
import { ViewEncapsulation } from "@angular/core";

@Component({
  selector: "pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
  encapsulation: ViewEncapsulation.None,
})

export class PaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() removePaddingButtom: boolean = false;
  @Input() paginationData: PaginationData;
  @Output() pageInfo = new EventEmitter<boolean>();

  //pagination variable
  pageSize: number;
  Page: number;
  printPage: number = 5;
  @Output() selectedPage: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.Page = this.paginationData.current_page;
    this.pageSize = this.paginationData.total_pages * 10;
    if (window.innerWidth < 576) {
      this.printPage = 1;
    } else if (window.innerWidth < 768) {
      this.printPage = 3;
    } else {
      this.printPage = 5;
    }
  }
  //this function is used to get previous page data
  // previousPage(){
  //   if (this.currentPage > 1) {
  //     this.pageInfo.emit(false);
  //   }
  // }

  //this function is used to get previous page data
  // nextPage(){
  //   if (this.paginationData.current_page < this.paginationData.total_pages) {
  //     this.pageInfo.emit(true);
  //   }
  // }

  //this function is call when page change
  onPage(selectedPage: any) {
    this.selectedPage.emit(selectedPage);
  }
}
