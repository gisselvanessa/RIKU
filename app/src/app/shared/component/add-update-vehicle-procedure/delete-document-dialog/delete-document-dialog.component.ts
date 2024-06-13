import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { LoanProcedureService } from 'src/app/modules/loan-procedure/loan-procedure.service';
import { VehicleProcedureService } from 'src/app/shared/services/vehicle-procedure.service';

import { Error } from 'src/app/shared/models/error.model';



@Component({
  selector: 'app-delete-document-dialog',
  templateUrl: './delete-document-dialog.component.html',
  styleUrls: ['./delete-document-dialog.component.scss']
})
export class DeleteDocumentDialogComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private vehicleProcedureService: VehicleProcedureService,
    private toastr: ToastrService, private loanProcedureService: LoanProcedureService) { }

  @Input() vehicleProcedureId: string;
  @Input() loanId: string;
  @Input() documentType: string;
  @Input() documentId: string;
  @Input() isCoApplicant: boolean = false;
  loading: boolean = false;

  ngOnInit(): void {
  }


  onSubmit() {
    this.loading = true;
    let data: any = {
      vp_id: this.vehicleProcedureId,
      current_step: this.documentType,
      vp_step_asset_id: this.documentId
    }
    let apiEndPoint = this.vehicleProcedureService.deleteDocument(data)
    if (this.loanId) {
      data = {
        loan_id: this.loanId,
        "type": this.documentType,
        "name": this.documentId,
        "is_co_applicant": this.isCoApplicant
      }
      apiEndPoint = this.loanProcedureService.deleteDocument(data)
    }
    apiEndPoint.subscribe({
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
