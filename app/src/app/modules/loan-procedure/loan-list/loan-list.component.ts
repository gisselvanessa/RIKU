import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { PaginationData } from 'src/app/modules/admin/admin-vehicles/models/vehicle.model';
import { LoanProcedureService } from '../loan-procedure.service';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { CancelLoanDialogComponent } from '../cancel-loan-dialog/cancel-loan-dialog.component';
@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {

  constructor(private loanProcedureService: LoanProcedureService, private modalService: NgbModal, private router: Router) { }


  loanList: any = [];
  selectedTab = 'draft';
  page: number = 1;
  limit: number;
  loading: boolean = true;
  getScreenWidth: any;
  paginationData: PaginationData = new PaginationData();
  isDataLoaded: boolean = false;

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 768) {
      this.limit = 10;
    } else {
      this.limit = 10;
    }
    this.getLoanList({ page: this.page, limit: this.limit })


  }

  selectTab(selectedTab: string) {
    this.selectedTab = selectedTab;
    this.getLoanList({ page: this.page, limit: this.limit })
  }

  jumpToThePage(page: number) {
    this.page = page;
    this.getLoanList({ page: this.page, limit: this.limit })

  }
  getLoanList(params: any) {
    this.loading = true;
    this.loanProcedureService.loanList(this.selectedTab, params).subscribe((resp: any) => {
      this.isDataLoaded = true;
      this.loanList = resp.data.items ? resp.data.items : [];
      this.paginationData = resp.data.pagination;
      this.loading = false;
    })
  }


  continue(loanId: string, stage?: any) {
    localStorage.setItem('current_loan_id', loanId);
    this.router.navigate(['/loan/loan-candidate-details'])
  }

  cancel(loanId: string) {
    const modalRef = this.modalService.open(CancelLoanDialogComponent, {
      windowClass: 'cancel-order-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.componentInstance.loanId = loanId;
    modalRef.result.then((isCancel) => {

      if (isCancel) {
        const index = this.loanList.findIndex((resp: any) => resp.id == loanId)
        if (index > -1) {
          this.loanList.splice(index, 1)
        }
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'success-modal'
        })
        modalRef.componentInstance.cancelLoanSuccess = true;
      }
    }).catch((error: Error) => {
    });
  }



}
