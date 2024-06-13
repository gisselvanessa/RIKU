import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoanService } from '../../loan.service';

import { DeleteDocumentDialogComponent } from 'src/app/shared/component/add-update-vehicle-procedure/delete-document-dialog/delete-document-dialog.component';
import { LoanStepsNumber, EmployementType, LoanDocuments, LoanStatus } from 'src/app/shared/constant/loan-constants';
import { Error } from 'src/app/shared/models/error.model';
import { PostAPIResponse } from 'src/app/shared/models/post-api-response.model';
import { LoanDocument } from 'src/app/modules/loan-procedure/load-procedure.model';
import { NotApproveDialogComponent } from '../../not-approve-dialog/not-approve-dialog.component';


@Component({
  selector: 'app-admin-applicant-documents',
  templateUrl: './applicant-documents.component.html',
  styleUrls: ['./applicant-documents.component.scss']
})

export class AdminApplicantDocumentsComponent implements OnInit {
  @Input() employmentType: string;
  @Input() loanDetail: any;
  @Input() userDocuments: any;
  @Input() isCoApplicant: boolean = false;
  @Output() onUploadDocuments: EventEmitter<{ loanDetail: any, nextStep: number }> = new EventEmitter();

  isDocumentUploading: boolean = false;
  uploadingDocument: string;
  loading: boolean = false;
  loanDocuments: any = {};
  loanStatus = LoanStatus;
  ctx: any;

  constructor(private toastr: ToastrService, private translate: TranslateService, private router: Router,
    private loanService: LoanService, private fileUploadService: FileUploadService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loanDocuments = this.userDocuments;
    this.ctx = { documentList: this.getLoanDocuments() };
  }

  deleteDocument(document: LoanDocument) {
    const modalRef = this.modalService.open(DeleteDocumentDialogComponent, {
      windowClass: 'delete-document-modal',
      backdrop: 'static',
      keyboard: false
    })
    modalRef.componentInstance.loanId = this.loanDetail.id;
    modalRef.componentInstance.documentType = document.type;
    modalRef.componentInstance.documentId = document.name;
    modalRef.componentInstance.isCoApplicant = document.is_co_applicant_document;
    modalRef.result.then((isDeleted) => {
      if (isDeleted) {
        this.toastr.success(this.translate.instant('Document deleted successfully!!'));
        delete this.loanDocuments[document.name];
        const documentIndex = this.loanDetail.documents.findIndex((x:LoanDocument) => x.name == document.name && x.is_co_applicant_document == document.is_co_applicant_document);
        this.loanDetail.documents.splice(documentIndex, 1);
        this.onUploadDocuments.emit({ loanDetail: this.loanDetail, nextStep: LoanStepsNumber.SUMMARY });
      }
    }).catch((error: any) => {
    });
  }

  getLoanDocuments(): any {
    if (this.employmentType == EmployementType.EMPLOYED) {
      return LoanDocuments['employed'];
    } else if (this.employmentType == EmployementType.SELF_EMPLOYED) {
      return LoanDocuments['self_employed'];
    } else if (this.employmentType == EmployementType.RETIRED) {
      return LoanDocuments['retired'];
    } else {
      return LoanDocuments['employed'];
    }
  }

  approveRejectDocument(document: LoanDocument, isApproved: boolean){
    this.loading = true;
    this.loanService.approveRejectDocument({ loan_id: this.loanDetail.id, document_id: document.id, is_approved: isApproved })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          const message = isApproved ? 'Document approved successfully!!' : 'Document rejected successfully!!'
          this.toastr.success(this.translate.instant(message));
          this.loanDocuments[document.name].is_verified = isApproved;
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      });
  }

  fileName(image:string){
    return image.substring(image.lastIndexOf('/')+1)
  }

  downloadFile(url:string){
    const filename = this.fileName(url);
    this.fileUploadService.downloadFile(url).subscribe((response: any) => {
      const blob: any = new Blob([response], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

}
