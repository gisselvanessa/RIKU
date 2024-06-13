import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { LoanProcedureService } from '../loan-procedure.service';

@Component({
  selector: 'app-cancel-loan-dialog',
  templateUrl: './cancel-loan-dialog.component.html',
  styleUrls: ['./cancel-loan-dialog.component.scss']
})
export class CancelLoanDialogComponent implements OnInit {

  @Input() loanId: string;
  loading: boolean = false;
  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService,
    private translate: TranslateService,
    private loanProcedureService: LoanProcedureService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.loading = true;
    this.loanProcedureService.cancelLoan(this.loanId).subscribe({
      next: () => {
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
        this.activeModal.close(false);
      }
    });
  }

  ngOnDestroy() {
  }

}
