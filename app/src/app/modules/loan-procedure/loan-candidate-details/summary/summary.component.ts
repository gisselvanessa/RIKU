import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { LoanProcedureService } from '../../loan-procedure.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DeleteDocumentDialogComponent } from 'src/app/shared/component/add-update-vehicle-procedure/delete-document-dialog/delete-document-dialog.component';
import { Error } from 'src/app/shared/models/error.model';
import { PostAPIResponse } from 'src/app/shared/models/post-api-response.model';
import { LoanDocument } from '../../load-procedure.model';
import { LoanStepsNumber, EmployementType, LoanDocuments  } from 'src/app/shared/constant/loan-constants';
import { OrderStepsNumber } from 'src/app/shared/constant/add-order-constants';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})

export class SummaryComponent implements OnInit, OnChanges {
  @Input() employmentType: string;
  @Input() loanDetail: any;
  @Input() userDocuments: any;
  @Input() isCoApplicant: boolean = false;
  @Output() onUploadDocuments: EventEmitter<{ loanDetail: any, nextStep: number }> = new EventEmitter();
  @ViewChild('uploadPersonalDoc') uploadPersonalDoc: ElementRef;

  isDocumentUploading: boolean = false;
  uploadingDocument: string;
  loading: boolean = false;
  loanDocuments: any = {};
  ctx: any;
  showUploadButton: boolean = true;

  constructor(private toastr: ToastrService, private translate: TranslateService, private loanProcedureService: LoanProcedureService,
    private fileUploadService: FileUploadService, private modalService: NgbModal) { }

  ngOnInit(): void {
    if(this.loanDetail && this.loanDetail.order?.current_stage){
      const currentOrderStep =  this.loanDetail.order.current_stage.toUpperCase();
      if(Number(OrderStepsNumber[currentOrderStep]) > OrderStepsNumber.LOAN){
        this.showUploadButton = false;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loanDocuments = this.userDocuments;
    this.ctx = { documentList: this.getLoanDocuments() };
  }

  async onFileChange(event: any, documentKey: string, documentType: string) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const totalBytes = file.size;
      const fileSize = Math.round(totalBytes / 1024);
      if (fileSize >= 5120) {
        this.toastr.error(this.translate.instant('File size must be smaller than 5 MB'));
        this.isDocumentUploading = false;
        this.loading = false;
        return;
      }
      const fileType = file.type;
      if (
        fileType != 'application/pdf'
      ) {
        this.toastr.error(this.translate.instant('Allowed file type is only PDF'));
        this.loading = false;
        return;
      }
      if (this.isDocumentUploading) {
        this.toastr.warning(this.translate.instant('One document is uploading currently, please try after document is uploaded.'));
        return;
      }
      this.isDocumentUploading = true;
      this.uploadingDocument = documentKey;
      const isFileUploaded = await this.getPreSignedUrl(file, documentKey);
      if (isFileUploaded) {
        if (this.isDocumentUploading) {
          this.uploadLoanDocuments(documentKey, documentType);
        }
      } else {
        this.isDocumentUploading = false;
      }
    }
  }

  async getPreSignedUrl(file: any, documentKey: string) {
    try {
      return new Promise((resolve, reject) => {
        this.fileUploadService
          .getLoanDocumentPreSignedUrl({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size
          })
          .subscribe(
            async (res: any) => {
              if (res.data.url && res.data.key) {
                await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe((data) => {
                  this.loanDocuments[documentKey] = {
                    key: res.data.key,
                    url: res.data.download_url,
                    is_allowed_to_delete: true,
                    name: documentKey
                  }
                  resolve(true);
                }, (error) => {
                  this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
                  reject(false);
                })
              }
            },
            (errorRes: Error) => {
              const error = errorRes.error;
              if (error.error[0]) {
                this.toastr.error(error.error[0]);
              } else {
                this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
              }
            }
          );
      });
    } catch (ex) {
    }
  }

  uploadLoanDocuments(documentKey: string, documentType: string) {
    if (this.loanDocuments[documentKey]) {
      const data = {
        "loan_id": this.loanDetail.id,
        "type": documentType,
        "name": documentKey,
        "key": this.loanDocuments[documentKey].key,
        "is_co_applicant": this.isCoApplicant
      }
      this.loading = true;
      this.loanProcedureService.uploadDocuments(data).subscribe({
        next: (res: PostAPIResponse) => {
          this.loading = false;
          this.isDocumentUploading = false;
          this.toastr.success(this.translate.instant('Document uploaded successfully!!'));
          this.uploadPersonalDoc.nativeElement.value = '';
          this.loanDocuments[documentKey] = { ...this.loanDocuments[documentKey], is_verified: null, is_co_applicant_document: this.isCoApplicant, 'id': res.data.id, type: documentType };
          if(!this.loanDetail.documents){
            this.loanDetail.documents = [];
          }
          this.loanDetail.documents.push(this.loanDocuments[documentKey]);
          this.onUploadDocuments.emit({ loanDetail: this.loanDetail, nextStep: LoanStepsNumber.SUMMARY });
        },
        error: (errorRes: Error) => {
          this.isDocumentUploading = false;
          const error = errorRes.error;
          this.uploadPersonalDoc.nativeElement.value = '';
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong, Please Try again later'));
          }
        }
      });
    }
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
}
