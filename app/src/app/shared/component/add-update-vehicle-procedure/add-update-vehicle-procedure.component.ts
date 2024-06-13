import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Order } from 'src/app/modules/buyers/buyer-orders/buyer-order.model';
import { OrderStages, OrderStepsNumber, VehicleProcedureSteps, VehicleProcedureStepsNumber } from '../../constant/add-order-constants';
import { getFileName, getFileType } from '../../helpers/file-helper';
import { Error } from '../../models/error.model';
import { PostAPIResponse } from '../../models/post-api-response.model';


import { FileUploadService } from '../../services/file-upload.service';
import { UserService } from '../../services/user.service';
import { VehicleProcedureService } from '../../services/vehicle-procedure.service';
import { CancelProcedureDialogComponent } from './cancel-procedure-dialog/cancel-procedure-dialog.component';
import { DeleteDocumentDialogComponent } from './delete-document-dialog/delete-document-dialog.component';
import { VehicleProcedureResponse, VehicleProcedureDetail } from './vehicle-procedure.model';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component'; 
import { getDateDiffInDays } from '../../helpers/date-helper';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SellerOrdersService } from 'src/app/modules/sellers/seller-orders/seller-orders.service';


@Component({
  selector: 'app-add-update-vehicle-procedure',
  templateUrl: './add-update-vehicle-procedure.component.html',
  styleUrls: ['./add-update-vehicle-procedure.component.scss']
})

export class AddUpdateVehicleProcedureComponent implements OnInit {
  @Input() currentStep?: number;
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Input() currentOrder: Order | any = new Order();
  isDocumentUploaded: boolean = false;
  vehicleProcedureDocuments: any = [];
  vehicleProcedureSteps: any = [];
  loading: boolean = false;
  vehicleProcedureDetail: VehicleProcedureDetail;
  @Input() vehicleProcedureId: string;
  @Input() userType: string;
  @Input() isCompleted: boolean = false;
  currentUserType: string;
  currentUser: string;
  orderId: string;
  currentProcedureStepNumber: number;
  loadingProcedureInfo: boolean = false;
  loadingLabel:string;
  @ViewChild('requestDocuments') requestDocuments: ElementRef;
  @ViewChild('contractDocuments') contractDocuments: ElementRef;
  @ViewChild('notaryDocuments') notaryDocuments: ElementRef;
  @ViewChild('taxPaymentDocuments') taxPaymentDocuments: ElementRef;
  @ViewChild('nationalTransitDocuments') nationalTransitDocuments: ElementRef;

  constructor(private sellerOrderService: SellerOrdersService,private toastr: ToastrService, private fileUploadService: FileUploadService,
    private vehicleProcedureService: VehicleProcedureService, private translate: TranslateService,
    private router: Router,private modalService: NgbModal, private userService: UserService, private location: Location) { }

  ngOnInit(): void {
    this.vehicleProcedureId = this.vehicleProcedureId ? this.vehicleProcedureId : this.currentOrder?.vehicle_procedure?.id;
    this.currentUserType = this.userService.getUserType();
    this.currentUser = this.userType;
   
    this.getVehicleProcedureDetails();
  }

  getVehicleProcedureDetails() {
    this.loadingProcedureInfo = true;
    this.vehicleProcedureService.getVehicleProcedureDetails(this.vehicleProcedureId).subscribe({
      next: (res: VehicleProcedureResponse) => {
        this.loadingProcedureInfo = false;
        this.vehicleProcedureDetail = res.data;
        this.orderId = this.vehicleProcedureDetail.order.id
        let currentStep: any = this.vehicleProcedureDetail.current_step.toUpperCase();
        currentStep = VehicleProcedureStepsNumber[currentStep];
        this.currentProcedureStepNumber = currentStep;
        if (this.vehicleProcedureDetail.steps?.length > 0) {
          this.vehicleProcedureDetail.steps.map((x: any) => {
            if (!this.vehicleProcedureDocuments[x.name]) {
              this.vehicleProcedureDocuments[x.name] = [];
              this.vehicleProcedureDocuments[x.name] = x.assets;
              delete x.assets;
              this.vehicleProcedureSteps[x.name] = x;
              const stepNumber: any = VehicleProcedureStepsNumber[x.name.toUpperCase()];
              this.vehicleProcedureSteps[x.name].is_completed = this.currentProcedureStepNumber > stepNumber;
              if (this.vehicleProcedureSteps[x.name].completed_at) {
                const diff: any = getDateDiffInDays(this.vehicleProcedureSteps[x.name].created_at, this.vehicleProcedureSteps[x.name].completed_at, true);
                this.vehicleProcedureSteps[x.name].days_to_complete = diff.includes('Days') ? diff.replace('Days', this.translate.instant('Days')) : diff.replace('Day', this.translate.instant('Day'));
              }
            }
          });
        }
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

  async onFileChange(event: any, documentName: string, label:string) {
    let files = event.target.files;
    this.loadingLabel = label;
    if (files) {
      let index = 0;
      if (!this.vehicleProcedureDocuments[documentName]) {
        this.vehicleProcedureDocuments[documentName] = [];
      }
      const totalDocuments = this.vehicleProcedureDocuments[documentName].length + files.length;
      if (files.length > 10 || totalDocuments > 10) {
        this.toastr.warning(this.translate.instant('Maximum 10 documents are allowed!!'));
        return;
      }
      this.loading = true;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 10240) {
          this.toastr.error(this.translate.instant('File size must be smaller than 10 MB'));
          this.isDocumentUploaded = false;
          this.loading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'image/png' &&
          fileType != 'image/jpeg' &&
          fileType != 'image/gif' &&
          fileType != 'application/pdf'
        ) {
          this.toastr.error(this.translate.instant('Allowed file type is only PDF, Images and Documents'));
          this.loading = false;
          return;
        }
        this.isDocumentUploaded = false;
        const isFileUploaded = await this.getPreSignedUrl(file, index, files.length, documentName);
        if (isFileUploaded) {
          if (index == (files.length - 1)) {
            this.isDocumentUploaded = true;
          } else if (index < (files.length - 1)) {
            index++;
          }
        } else if (index <= (files.length - 1) && !isFileUploaded) {
          this.isDocumentUploaded = false;
          this.loading = false;
          break;
        }
        if (this.isDocumentUploaded) {
          this.uploadVehicleProcedureDocuments(documentName);
        }
      }
    }
  }

  async getPreSignedUrl(file: any, index: number, totalFiles: number, documentName: string) {
    try {
      return new Promise((resolve, reject) => {
        this.fileUploadService
          .getVehicleProcedurePreSignedUrl({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size
          })
          .subscribe(
            async (res: any) => {
              if (res.data.url && res.data.key) {
                await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe((data) => {
                  if (!this.vehicleProcedureDocuments[documentName]) {
                    this.vehicleProcedureDocuments[documentName] = [];
                  }
                  this.vehicleProcedureDocuments[documentName].push({
                    key: res.data.key,
                    url: res.data.download_url,
                    is_allowed_to_delete: true
                  });
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
              this.loading = false;
            }
          );
      });
    } catch (ex) {
    }
  }

  uploadVehicleProcedureDocuments(vehicleProcedureStepName: string) {
    if (this.vehicleProcedureDocuments[vehicleProcedureStepName]?.length > 0) {
      const stepDocuments = this.vehicleProcedureDocuments[vehicleProcedureStepName].filter((x: any) => !x.id);
      const documents: Array<string> = stepDocuments.map((document: any) => { if (document.key) { return document.key } });
      const data = {
        vp_id: this.vehicleProcedureId,
        current_step: vehicleProcedureStepName,
        assets: documents.filter(x => x)
      }
      this.loading = true;
      this.vehicleProcedureService.uploadDocuments(data).subscribe({
        next: (res: PostAPIResponse) => {
          this.loading = false;
          if (res.data.assets?.length > 0) {
            res.data.assets.map((asset: any) => {
              if (asset.key) {
                const index = this.vehicleProcedureDocuments[vehicleProcedureStepName].findIndex((x: any) => x.key == asset.key);
                if (index > -1) {
                  this.vehicleProcedureDocuments[vehicleProcedureStepName][index].id = asset.id;
                }
              }
            })
          }
          this.resetFileInput(vehicleProcedureStepName);
          this.toastr.success(this.translate.instant('Documents uploaded successfully!!'))
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
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

  resetFileInput(documentName: string){
    switch (documentName) {
      case VehicleProcedureSteps.REQUEST_FOR_DOCUMENTS:
        this.requestDocuments.nativeElement.value = '';
        break;
      case VehicleProcedureSteps.CONTRACT_DEVELOPMENT:
        this.contractDocuments.nativeElement.value = '';
        break;
      case VehicleProcedureSteps.NOTARY:
        this.notaryDocuments.nativeElement.value = '';
        break;
      case VehicleProcedureSteps.TAX_PAYMENT_ORDERS:
        this.taxPaymentDocuments.nativeElement.value = '';
        break;
      case VehicleProcedureSteps.NATIONAL_TRANSIT:
        this.nationalTransitDocuments.nativeElement.value = '';
        break;
      default:
        break;
    }
  }

  setNextStep() {
    this.router.navigate([`/user/buyer-orders/order-details/${this.currentOrder.order_id}`])
    // this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: OrderStepsNumber.VEHICLE_DELIVERY_STATUS });
  }

  setPreviousStep() {
    const nextStep = this.currentOrder.loan?.id ? OrderStepsNumber.LOAN :OrderStepsNumber.BUY_NOW;
    this.onSubmitDetails.emit({ orderDetail: this.currentOrder, nextStep: nextStep });
  }

  getFileType(url: string) {
    return getFileType(url);
  }


  getFileName(url: string) {
    return getFileName(url);
  }

  deleteDocument(documentId: string, documentType: string, index: number) {
    const modalRef = this.modalService.open(DeleteDocumentDialogComponent, {
      windowClass: 'delete-document-modal',
      backdrop: 'static',
      keyboard: false
    })
    modalRef.componentInstance.vehicleProcedureId = this.vehicleProcedureId;
    modalRef.componentInstance.documentType = documentType;
    modalRef.componentInstance.documentId = documentId;

    modalRef.result.then((isDeleted) => {
      if (isDeleted) {
        this.vehicleProcedureDocuments[documentType].splice(index, 1);
        this.toastr.success(this.translate.instant('Document deleted successfully!!'));
      }
    }).catch((error: any) => {
    });
  }

  finalizeOrder() {
    localStorage.removeItem('current_order_id');

    // this.buyerOrderService.setCurrentOrder(this.vehicleProcedureDetail.orderDetails)
    this.router.navigate([`/user/buyer-orders/order-list`])
    this.applyStatus();
  }

  applyStatus() {
    this.sellerOrderService.sendDeliveryStatus('confirmed', this.orderId).subscribe({next:(resp: any) => {
      if (resp.success_code === 'VEHICLE_DELIVERY_STATUS_UPDATED') {
        this.vehicleProcedureService.getVehicleProcedureDetails(this.vehicleProcedureId).subscribe({
          next: (res: VehicleProcedureResponse) => {
            this.vehicleProcedureDetail = res.data;
          }
        })
      }
    },
    error:(errorRes: Error)=>{
      const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant("Something Went Wrong Please Try again later"));
        }
    }
  })
  }

  public get orderCurrentStage(): typeof OrderStages {
    return OrderStages;
  }

  public get orderCurrentStepNumber(): typeof OrderStepsNumber {
    return OrderStepsNumber;
  }

  public get vehicleProcedureStepsName(): typeof VehicleProcedureSteps {
    return VehicleProcedureSteps;
  }

  public get procedureStepNumber(): typeof VehicleProcedureStepsNumber {
    return VehicleProcedureStepsNumber;
  }

  public cancelVehicleProcedure(): void {
    const modalRef = this.modalService.open(CancelProcedureDialogComponent, {
      windowClass: 'cancel-procedure-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.componentInstance.vehicleProcedureId = this.vehicleProcedureId;
    modalRef.componentInstance.currentStage = this.vehicleProcedureDetail.current_step;
    modalRef.result.then((isCanceled) => {
      if (isCanceled) {
        this.showCancelSuccessModal();
      }
    }).catch((error: any) => {
    });
  }


  public showCancelSuccessModal() {
    const successModalRef = this.modalService.open(SuccessfullComponent, {
      windowClass: 'cancel-procedure-success-modal',
      backdrop: 'static',
      keyboard: false
    })
    successModalRef.componentInstance.procedureCancelSuccess = true;
    successModalRef.componentInstance.orderId = this.currentOrder.order_id;
    successModalRef.result.then((isCanceled) => {
      this.setNextStep();
    }).catch((error: any) => {
      this.setNextStep();
    });
  }

  public confirmPayment(isPaymentReceived: boolean) {
    const data: any = {
      is_payment_received: isPaymentReceived,
      order_payment_confirmation_id: this.vehicleProcedureDetail.payment_confirmation?.id
    }
    this.loading = true;
    this.vehicleProcedureService.confirmPayment(data).subscribe({
      next: (res: PostAPIResponse) => {
        this.loading = false;
        this.vehicleProcedureDetail.payment_confirmation.is_confirmed = isPaymentReceived;
        this.toastr.success(this.translate.instant('Payment status updated successfully!!'));
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

  back() {
    this.location.back();
  }
}

// amount
// :
// 12
// date
// :
// "2023-03-01T00:00:00.000+00:00"
// id
// :
// "50350042-1d30-48cf-b372-86f078da1264"
// is_confirmed
// :
// null
// time
// :
// "2023-03-01T00:15:00.000+00:00"
