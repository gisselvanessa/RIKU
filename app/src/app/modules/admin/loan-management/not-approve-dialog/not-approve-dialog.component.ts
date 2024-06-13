import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { LoanService } from '../loan.service';
import { Error } from 'src/app/shared/models/error.model';


@Component({
  selector: 'app-not-approve-dialog',
  templateUrl: './not-approve-dialog.component.html',
  styleUrls: ['./not-approve-dialog.component.scss']
})
export class NotApproveDialogComponent implements OnInit {

  @Input() loanId: string;
  loading: boolean = false;

  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService, private loanService: LoanService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true;
    this.loanService.deleteLoan(this.loanId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong, Please Try again later');
        }
        this.activeModal.close(false);
      }
    });
  }
}
