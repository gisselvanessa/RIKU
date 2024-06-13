import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { AdminVehicleProcedureService } from '../../admin-vehicle-procedure.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddOrderConstants } from '../../../../../shared/constant/add-order-constants';
import { DatePipe } from '@angular/common';
import { DeleteDocumentDialogComponent } from 'src/app/shared/component/add-update-vehicle-procedure/delete-document-dialog/delete-document-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getDateDiffInDays } from 'src/app/shared/helpers/date-helper';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { VehicleProcedure } from '../../../../sellers/seller-orders/seller-order.model';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/shared/services/user.service';
import { VehicleProcedureService } from 'src/app/shared/services/vehicle-procedure.service';
import { LoanProcedureService } from 'src/app/modules/loan-procedure/loan-procedure.service';

@Component({
  selector: 'request-for-doc',
  templateUrl: './request-for-doc.component.html',
  styleUrls: ['./request-for-doc.component.scss'],
  providers: [DatePipe]
})

export class RequestForDocComponent implements OnInit, OnDestroy {

  @Input() vehicleProcedureData: any;
  @Input() vehicleProcedureId: string;
  @Output() currentStep: EventEmitter<any> = new EventEmitter<number>();
  @Output() currentStatus: EventEmitter<any> = new EventEmitter<number>();
  @Output() heighlightedScreen: EventEmitter<any> = new EventEmitter<number>();
  @Output() currentCompletedStep: EventEmitter<any> = new EventEmitter<number>();
  @ViewChild('uploadReceipt') uploadReceiptData: any;
  highlightedStep = 0;
  completedStep = 0;
  step = 0;
  loading = false;
  isDataLoadead = false;
  disabled = true;
  requestDocList: { [key: string]: string } = {
    'Identification documents, certificates of the seller': 'identification_documents',
    'Identification documents, certificates of the buyer': 'identification_documents_buyer',
    'Unique vehicle certificate': 'unique_vehicle_certificate_ant',
    'Registration': 'copy_of_registration',
    'Commercial certificate': 'commercial_certificate',
    'Special power to manage procedures': 'special_power'
  }

  contractDevelopmentDocList: { [key: string]: string } = {
    'Purchase Contract': 'purchase_contract',
    'Contracts of power to carry out the vehicle process': 'contracts_of_power_to_carry_out_the_vehicle_process',
  }

  notaryDocList: { [key: string]: string } = {
    'Notarization of sales contract': 'notarization_of_sales_contract',
    'Contracts of power to carry out the vehicle process': 'contract_of_power_to_carry_out_the_vehicle_procedure'
  }
  taxPaymentDocList: { [key: string]: string } = {
    'Tuition payment': 'tuition_payment',
    // 'Duplicate registration payment': 'duplicate_registration_payment',
    'SRI domain transfer payment(original)': 'sri_domain_transfer_payment',
    'Municipal tax payments': 'municipal_tax_payments',
    'Payments of fines and infractions': 'payments_of_fines_and_infractions',
    'Request for shift application of the ANT': 'request_for_shift_application_of_the_ant'
  }
  moneyTransferDocList: { [key: string]: string } = {
    'Proof to transfer': 'proof_to_transfer'
  }

  nationalDocList: { [key: string]: string } = {
    'Shift generation in ANT': 'enabling_and_sales_contract',
    'Documents delivery': 'tax_payments_made',
    // 'Power of attorney contract': 'power_of_attorney_contract',
  }

  registrationDocList: { [key: string]: string } = {
    'New owner registration': 'new_owner_registration'
  }
  data: any = [];
  uploadedDocList: any = [];
  stepsStepper = [
    {
      'step': 1,
      'title': 'Request for Documents',
      'stepValue': 'request_for_documents',
      'docList': this.requestDocList,
      'selectedDocList': this.data,
      'marskAsComplete': false,
      'isFormValid': true,
      'isError': false,
      'isValid': false,
      'uploadedImage': this.uploadedDocList,
      'message': 'Please select at least one document.',
      'isStepCompleted': false,
      'daysToCompelate': '',
      'isImageMessage':'',
    },

    {
      'step': 2,
      'title': 'Contract Development',
      'stepValue': 'contract_development',
      'docList': this.contractDevelopmentDocList,
      'selectedDocList': this.data,
      'marskAsComplete': false,
      'isFormValid': true,
      'isError': false,
      'isValid': false,
      'uploadedImage': this.uploadedDocList,
      'message': 'Please select at least one document.',
      'isStepCompleted': false,
      'daysToCompelate': '',
      'isImageMessage':'',
    },

    {
      'step': 3,
      'title': 'Notary',
      'stepValue': 'notary',
      'docList': this.notaryDocList,
      'selectedDocList': this.data,
      'marskAsComplete': false,
      'isFormValid': true,
      'isError': false,
      'isValid': false,
      'uploadedImage': this.uploadedDocList,
      'message': 'Please select at least one document.',
      'isStepCompleted': false,
      'daysToCompelate': '',
      'isImageMessage':'',
    },

    

    {
      'step': 4,
      'title': 'Transfer of money to the seller',
      'stepValue': 'money_transfer_to_seller',
      'docList': this.moneyTransferDocList,
      'selectedDocList': this.data,
      'marskAsComplete': false,
      'isFormValid': true,
      'isError': false,
      'isValid': false,
      'isImageValid': false,
      'uploadedImage': this.uploadedDocList,
      'message': 'Please select at least one document.',
      'isStepCompleted': false,
      'daysToCompelate': '',
      'isImageMessage': 'Please upload at least one document.'
    },
    {
      'step': 5,
      'title': 'Vehicle tax payment orders',
      'stepValue': 'tax_payment_orders',
      'docList': this.taxPaymentDocList,
      'selectedDocList': this.data,
      'marskAsComplete': false,
      'isFormValid': true,
      'isError': false,
      'isValid': false,
      'uploadedImage': this.uploadedDocList,
      'message': 'Please select all documents.',
      'isStepCompleted': false,
      'daysToCompelate': '',
      'isImageMessage':'',
    },

    {
      'step': 6,
      'title': 'National transit agency',
      'stepValue': 'national_transit',
      'docList': this.nationalDocList,
      'selectedDocList': this.data,
      'marskAsComplete': false,
      'isFormValid': true,
      'isError': false,
      'isValid': false,
      'uploadedImage': this.uploadedDocList,
      'message': 'Please select at least one document.',
      'isStepCompleted': false,
      'daysToCompelate': '',
      'isImageMessage':'',
    },

    {
      'step': 7,
      'title': 'Delivery of the registration to the client',
      'stepValue': 'registration_delivery',
      'docList': this.registrationDocList,
      'selectedDocList': this.data,
      'marskAsComplete': false,
      'isFormValid': true,
      'isError': false,
      'isImageValid': false,
      'uploadedImage': this.uploadedDocList,
      'message': 'Please select at least one document.',
      'isStepCompleted': false,
      'daysToCompelate': '',
      'isImageMessage': 'Please upload at least one document.',
    }
  ];
  selectedDocList: any = [];
  markAsComplateForm: FormGroup;
  fifteStep: FormGroup;
  isApiCalled = false;
  formSubmitted = false;
  isReceiptError = false;
  isReceiptUploading = false;

  //***date time */
  maxDate = new Date();
  timeList: Array<string> = AddOrderConstants.timeList;
  orderStage: any = AddOrderConstants.orderStages;
  meetingDetailForm: FormGroup<any>;
  searchTime: string;
  TransferOfMoneyReceipt: any = {};
  DeliveryOfRegistrationReceipt: any = {};
  isFormSubmitted = false;
  index: number;
  //***data time */
  constructor(
    private adminVehicleProcedureService: AdminVehicleProcedureService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private fileUploadService: FileUploadService,
    private translate: TranslateService,
    private userService:UserService,
    private vehicleProcedureService: VehicleProcedureService,
    private loanProcedureService: LoanProcedureService
  ) {

    this.meetingDetailForm = this.fb.group(
      {
        amount: ['', [Validators.required]],
        transfer_date: [, [Validators.required]],
        transfer_time: ['', [Validators.required]],
        asset_key: ['', [Validators.required]]
      }
    );
  }

  setData() {
    const arrangeSequence: any = [];
    this.stepsStepper.forEach(async (elements: any) => {
      await this.vehicleProcedureData.steps.forEach((ele: any) => {
        if (elements.stepValue === ele.name) {
          arrangeSequence.push(ele);
        }
      })
    })
    this.vehicleProcedureData.steps = arrangeSequence;
    
  }

  ngOnInit(): void {
    this.setData();
    this.markAsComplateForm = this.fb.group({
      checkMark: false
    });
    let updatedCurrentStep = this.stepsStepper.filter((elements: any) => { return elements.stepValue === this.vehicleProcedureData.current_step });
    for (let i = 0; i < updatedCurrentStep[0].step - 1; i++) {
      this.stepsStepper[i].marskAsComplete = true;
      this.stepsStepper[i].isValid = true;
      this.stepsStepper[i].selectedDocList = this.vehicleProcedureData.steps[i].documents;
      this.stepsStepper[i].uploadedImage = this.vehicleProcedureData.steps[i].assets;
      this.stepsStepper[i].isStepCompleted = true;
      const diff: any = getDateDiffInDays(this.vehicleProcedureData.steps[i].created_at, this.vehicleProcedureData.steps[i].completed_at, true);
      this.stepsStepper[i].daysToCompelate = diff.includes('Days') ? diff.replace('Days', this.translate.instant('Days')) : diff.replace('Day', this.translate.instant('Day'));
    }
    for (let i = 0; i < updatedCurrentStep[0].step; i++) {
      this.stepsStepper[i].uploadedImage = this.vehicleProcedureData.steps[i].assets;
    }

    this.isDataLoadead = true;
    this.step = updatedCurrentStep[0].step - 1;
    this.completedStep = updatedCurrentStep[0].step - 1;

    if (this.vehicleProcedureData.status === 'completed') {
      this.stepsStepper[this.step].marskAsComplete = true;
      this.stepsStepper[this.step].isValid = true;
      this.stepsStepper[this.step].selectedDocList = this.vehicleProcedureData.steps[this.step].documents;
      this.TransferOfMoneyReceipt = this.vehicleProcedureData.steps[4].assets?.length ? { imageURL: this.vehicleProcedureData.steps[4].assets[0].url } : { url: '' };
      this.DeliveryOfRegistrationReceipt = this.vehicleProcedureData.steps[6].assets?.length ? { imageURL: this.vehicleProcedureData.steps[4].assets[0].url } : { url: '' };
      this.step = 0;
    }

    let transferOfMoney = this.vehicleProcedureData.payment_confirmation;
    if (transferOfMoney?.amount && transferOfMoney?.time && transferOfMoney?.date) {
      this.meetingDetailForm.patchValue({
        amount: transferOfMoney?.amount,
        transfer_date: transferOfMoney.date,
        transfer_time: transferOfMoney.time,
      })
    }
    if(this.step==4 && !this.vehicleProcedureData.payment_confirmation.is_confirmed){ // In step 4, a warning will appear if the payment is not confirmed by the seller/dealer.
      const message = this.translate.instant("The payment has not yet been confirmed by the seller/dealer")
      this.toastr.warning(message);
    }
  }

  selecDocList(docName: any) {
    const index: number = this.selectedDocList.indexOf(docName);
    if (index !== -1) {
      this.selectedDocList.splice(index, 1);

      if (this.selectedDocList.length === 0) {
        this.stepsStepper[this.step].isFormValid = false;
        this.stepsStepper[this.step].isValid = false;
        this.stepsStepper[this.step].isError = true;
      }
    } else {
      this.selectedDocList.push(docName);
      if (this.step === 3) {
        if (this.selectedDocList.length === Object.keys(this.stepsStepper[this.step].docList).length) {
          this.stepsStepper[this.step].isFormValid = true;
          this.stepsStepper[this.step].isValid = true;
          this.stepsStepper[this.step].isError = false;
        }
      } else {
        this.stepsStepper[this.step].isFormValid = true;
        this.stepsStepper[this.step].isValid = true;
        this.stepsStepper[this.step].isError = false;
      }
    }
  }

  selectedDocExist(docName: string) {
    return (this.selectedDocList.indexOf(docName) > -1) ? true : false;
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return 0;
  }

  viewNextScreen() {
    this.markAsComplateForm.reset();
    this.step += 1;
    this.heighlightedScreen.emit(this.step);
    if (this.step == 7) this.router.navigate(['/admin/vehicle-procedure']);
    if (this.step == 4 && !this.vehicleProcedureData.payment_confirmation.is_confirmed) {
      const message = this.translate.instant("Payment is not confirmed by seller/dealer");
      this.toastr.warning(message);
    }
  }

  viewPreviousScreen() {
    this.markAsComplateForm.reset();
    this.step -= 1;
    this.heighlightedScreen.emit(this.step);
  }

  checkValue(val: any) {
    if (this.vehicleProcedureData.status === 'cancelled') {
      const message = this.translate.instant("This order is already cancelled")
      this.toastr.error(message);
      return;
    }
    this.markAsComplateForm.patchValue({
      checkMark: false
    });
    if (!this.loading && !this.stepsStepper[this.step].isValid) {
      this.stepsStepper[this.step].isError = true;
      this.stepsStepper[this.step].isValid = false;
      this.stepsStepper[this.step].isFormValid = false;
      if (this.step === 3 && !this.stepsStepper[this.step].marskAsComplete) {
        this.formSubmitted = true;
        this.meetingDetailForm.markAllAsTouched();
      }
    } else {
      if (!this.isApiCalled) this.markAsComplete();
    }
  }


  checkValuewithImage(val: any) {
    if (this.vehicleProcedureData.status === 'cancelled') {
      const message = this.translate.instant("This order is already cancelled")
      this.toastr.error(message);
      return;
    }
    if (this.step === 3 && this.stepsStepper[this.step].uploadedImage.length) {
      this.stepsStepper[this.step].isImageValid = true;
      this.meetingDetailForm.patchValue({
        asset_key:  this.stepsStepper[this.step].uploadedImage[0].key
      });
    }
    if (this.step === 6 && this.stepsStepper[this.step].uploadedImage.length) {
      this.stepsStepper[this.step].isImageValid = true;
    }
    this.markAsComplateForm.patchValue({
      checkMark: false
    });
    if ((!this.loading && this.meetingDetailForm.valid && this.stepsStepper[this.step].isImageValid) || (this.step === 6 && !this.isReceiptError && this.stepsStepper[this.step].isImageValid)) {
      if (!this.isApiCalled) this.markAsComplete();
    } else {
      this.stepsStepper[this.step].isError = true;
      this.stepsStepper[this.step].isValid = false;
      this.stepsStepper[this.step].isFormValid = false;
      if (this.step === 3) {
        this.formSubmitted = true;
        this.meetingDetailForm.markAllAsTouched();
      } else {
        this.isReceiptError = true;
      }
    }
  }

  //this function is used to for mark as completed
  markAsComplete() {
    this.isApiCalled = true;
    this.loading = true;
    let markAsCompleteParams: any = {};
    markAsCompleteParams.vp_id = this.vehicleProcedureId;
    markAsCompleteParams.current_step = this.stepsStepper[this.step].stepValue;
    // if (this.step < 4 || this.step === 5) {  Mark as Complete Validation when there is no documents
    if ( this.step === 0 || this.step === 4 ) {
      markAsCompleteParams.documents = this.selectedDocList;
      if (this.stepsStepper[this.step].uploadedImage.length == 0) {
        this.loading = false;
        this.isApiCalled = false;
        const message = this.translate.instant("You can't verify the require documets list without checking the documents")
        this.toastr.warning(message);
        return;
      }
    } else if (this.step === 3) {
      markAsCompleteParams.amount = this.meetingDetailForm.value.amount;
      markAsCompleteParams.date = this.meetingDetailForm.value.transfer_date
      markAsCompleteParams.time = this.meetingDetailForm.value.transfer_time;
      markAsCompleteParams.asset_key = this.meetingDetailForm.value.asset_key;
      markAsCompleteParams.documents = ['proof_to_transfer'];
    } else if (this.step === 6) {
      markAsCompleteParams.documents = ['new_owner_registration'];
      markAsCompleteParams.asset_key = this.stepsStepper[this.step].uploadedImage[this.stepsStepper[this.step].uploadedImage.length - 1].key;
    } else if (this.step === 1 || this.step === 2 || this.step === 5) { // Add validation so that it allows me to mark the Development step as complete, Subscription, ANT, without documents uploaded
      markAsCompleteParams.documents = this.selectedDocList;
    }
       
    this.adminVehicleProcedureService.markAsComplete(markAsCompleteParams).subscribe({
      next: () => {
        //trigger nitifications
        this.userService.updateNotificationList(true);

        this.isApiCalled = false;
        this.stepsStepper[this.step].isFormValid = true;
        this.stepsStepper[this.step].isValid = true;
        this.stepsStepper[this.step].isError = false;
        this.stepsStepper[this.step].marskAsComplete = true;
        this.stepsStepper[this.step].selectedDocList = this.selectedDocList;
        this.selectedDocList = [];
        this.completedStep += 1;
        this.loading = false;
        this.currentCompletedStep.emit(this.step + 1);
        this.currentStep.emit(this.step + 1);
        this.heighlightedScreen.emit(this.step);
        if (this.step === 3){
          this.isFormSubmitted = false;
          if(!this.vehicleProcedureData.payment_confirmation.is_confirmed) {
            const message = this.translate.instant("Payment is not confirmed by seller/dealer");
            this.toastr.warning(message);
          }
        } 
        if (this.step === 6) {
          this.currentStatus.emit(true);
          this.vehicleProcedureData.status = 'completed';
        }
      },
      error: (errorRes: Error) => {
        this.isApiCalled = false;
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

  submitAssets(img: string) {
    let assestData: any = {};
    assestData.vp_id = this.vehicleProcedureId;
    assestData.current_step = this.stepsStepper[this.step].stepValue;
    assestData.assets = [img];
    this.adminVehicleProcedureService.submitASsets(assestData).subscribe({
      next: (res) => {
        if (this.step === 3) {
          this.TransferOfMoneyReceipt.id = res.data.assets[0].id;
        } else {
          this.DeliveryOfRegistrationReceipt.id = res.data.assets[0].id;
        }
        if (res.data.assets?.length > 0) {
          res.data.assets.map((asset: any) => {
            if (asset.key) {
              const index = this.stepsStepper[this.step].uploadedImage.findIndex((x: any) => x.key == asset.key);
              if (index > -1) {
                this.stepsStepper[this.step].uploadedImage[index].id = asset.id;
              }
            }
          })
        }
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
    });

  }


  setMeetingTime(event: any) {
    this.meetingDetailForm.controls['transfer_time'].patchValue(event.target.value);
  }

  async onFileChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          const message = this.translate.instant("File size must be smaller than 5 MB")
          this.toastr.error(message);
          this.isReceiptUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'image/png' &&
          fileType != 'image/jpeg' &&
          fileType != 'application/pdf'
        ) {
          const message = this.translate.instant("Allowed file type is only PDF, PNG")
          this.toastr.error(message);
          return;
        }
        this.isReceiptUploading = true;
        await this.getPreSignedUrl(file).then((success) => {
          if (success) {
            setTimeout(() => {
              this.isReceiptUploading = false;
            }, 3000);
          }
        })
          .catch((error) => {
            this.isReceiptUploading = false;
            return;
          });
      }
    }
  }

  //this functiojn is called when ROC Document, Legal Document or Prfile pucture change
  getPreSignedUrl(
    file: any,
  ) {
    return new Promise((resolve, reject) => {
      let preSignedURL: any;
      preSignedURL = this.adminVehicleProcedureService.getVPSPreSignedUrl({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });
      preSignedURL
        .subscribe(
          async (res: any) => {
            if (res.data.url && res.data.key) {
              await this.adminVehicleProcedureService.uploadFile(res.data.url, file).pipe().subscribe((data: any) => {
                this.stepsStepper[this.step].isImageValid = true;
                if (this.step === 3) {
                  this.TransferOfMoneyReceipt.imageURL = res.data.download_url;
                  if (this.stepsStepper[this.step].uploadedImage.length) {
                    this.stepsStepper[this.step].uploadedImage.forEach((ele:any, index:number)=>{
                      this.deleteUploadedDocument(ele.id, ele.index)
                    })
                  }
                  setTimeout(() => {
                    if(!this.stepsStepper[this.step].uploadedImage.length){
                      this.stepsStepper[this.step].uploadedImage.push({
                        key: res.data.key,
                        url: res.data.download_url,
                        is_allowed_to_delete: true
                      });
                      this.meetingDetailForm.patchValue({
                        asset_key: res.data.key
                      });
                      this.submitAssets(res.data.key);
                    }
                  }, 3000);
                } else if (this.step === 4) {
                  // if (this.stepsStepper[this.step].uploadedImage.length) {
                  //   this.stepsStepper[this.step].uploadedImage.forEach((ele:any, index:number)=>{
                  //     this.deleteUploadedDocument(ele.id, ele.index)
                  //   })
                  // }
                  // setTimeout(() => {
                  //   if(!this.stepsStepper[this.step].uploadedImage.length){
                      this.stepsStepper[this.step].uploadedImage.push({
                        key: res.data.key,
                        url: res.data.download_url,
                        is_allowed_to_delete: true
                      });
                      // this.meetingDetailForm.patchValue({
                      //   asset_key: res.data.key
                      // });
                      this.submitAssets(res.data.key);
                  //   }
                  // }, 3000);
                } else {
                  this.DeliveryOfRegistrationReceipt.imageURL = res.data.download_url;
                  if (this.stepsStepper[this.step].uploadedImage.length) {
                    this.stepsStepper[this.step].uploadedImage.forEach((ele:any, index:number)=>{
                      this.deleteUploadedDocument(ele.id, ele.index)
                    })
                  }
                  setTimeout(() => {
                    if(!this.stepsStepper[this.step].uploadedImage.length){
                      this.stepsStepper[this.step].uploadedImage.push({
                        key: res.data.key,
                        url: res.data.download_url,
                        is_allowed_to_delete: true
                      });
                      this.isReceiptError = false;
                      this.stepsStepper[this.step].isError = true;
                      this.stepsStepper[this.step].isValid = false;
                      this.stepsStepper[this.step].isFormValid = false;
                      this.submitAssets(res.data.key);
                    }
                  }, 3000);
                }
                resolve(true);
              }, () => {

                const message = this.translate.instant("Something Went Wrong Please Try again later")
                this.toastr.error(message);
                reject(true);
              })
            }
          },
          (error: any) => {
            if (error.error.error[0]) {
              this.isReceiptUploading = false
              this.toastr.error(error.error.error[0]);
            } else {
              this.isReceiptUploading = false
              const message = this.translate.instant("Something Went Wrong Please Try again later")
              this.toastr.error(message);
            }
          }
        );
    });
  }

  public deleteDocument(id: string, index: number = 0) {
    const modalRef = this.modalService.open(DeleteDocumentDialogComponent, {
      windowClass: 'delete-document-modal',
      backdrop: 'static',
      keyboard: false
    })

    modalRef.componentInstance.vehicleProcedureId = this.vehicleProcedureId;
    modalRef.componentInstance.documentType = this.stepsStepper[this.step].stepValue;
    modalRef.componentInstance.documentId = id;

    modalRef.result.then((isDeleted) => {
      if (isDeleted) {
        this.stepsStepper[this.step].isImageValid = false;
        if (this.step === 3) {
          this.stepsStepper[this.step].uploadedImage.splice(index, 1);
          this.meetingDetailForm.patchValue({
            asset_key: null
          });
          this.TransferOfMoneyReceipt = {};
          this.uploadReceiptData.nativeElement.value = '';
        } else if (this.step === 6) {
          this.DeliveryOfRegistrationReceipt.imageURL = '';
          this.stepsStepper[this.step].uploadedImage.splice(index, 1);
          this.isReceiptError = true;
          this.stepsStepper[this.step].isError = true;
          this.stepsStepper[this.step].isValid = false;
          this.stepsStepper[this.step].isFormValid = false;
          this.DeliveryOfRegistrationReceipt = {};
          this.uploadReceiptData.nativeElement.value = '';
        } else if (this.step === 4) {
          this.stepsStepper[this.step].uploadedImage.splice(index, 1);
          this.meetingDetailForm.patchValue({
            asset_key: null
          });
          this.uploadReceiptData.nativeElement.value = '';
        }

        const message = this.translate.instant("Document deleted successfully!!")
        this.toastr.success(message);
      }
    }).catch((error: any) => {
    });
  }

  public deleteUploadedDocument(id: string, index: number = 0) {
    const documentType = this.stepsStepper[this.step].stepValue;
    let data: any = {
      vp_id: this.vehicleProcedureId,
      current_step: documentType,
      vp_step_asset_id: id
    }
    let apiEndPoint = this.vehicleProcedureService.deleteDocument(data)
    apiEndPoint.subscribe({
      next: (res: any) => {
        this.stepsStepper[this.step].isImageValid = false;
        if (this.step === 3) {
          this.stepsStepper[this.step].uploadedImage.splice(index, 1);
          this.meetingDetailForm.patchValue({
            asset_key: null
          });
          this.TransferOfMoneyReceipt = {};
          this.uploadReceiptData.nativeElement.value = '';

        } else if (this.step === 6) {
          this.DeliveryOfRegistrationReceipt.imageURL = '';
          this.stepsStepper[this.step].uploadedImage.splice(index, 1);
          this.stepsStepper[this.step].isError = true;
          this.stepsStepper[this.step].isValid = false;
          this.stepsStepper[this.step].isFormValid = false;
          this.DeliveryOfRegistrationReceipt = {};
          this.uploadReceiptData.nativeElement.value = '';
        }
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error('Something Went Wrong, Please Try again later');
        }
      }
    });
  }

  goToListing() {
    this.router.navigate(['/admin/vehicle-procedure']);
  }

  ngOnDestroy(): void {
    this.stepsStepper = [];
  }

  deletedData(data: any) {
    this.stepsStepper[this.step].uploadedImage = data;
  }


  fileName(image: string) {
    return image.substring(image.lastIndexOf('/') + 1)
  }

  getFileType(url: string) {
    return getFileType(url);
  }

  downloadFile(url: string) {
    const filename = url.substring(url.lastIndexOf('/') + 1);
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

  // setDate(date: any) {
  //   this.meetingDetailForm.patchValue({
  //     transfer_date: this.datePipe.transform(date, 'dd-MMMM-yyyy')
  //   })
  // }

  getDate(date: any) {
    return this.datePipe.transform(date, 'dd-MMMM-yyyy')
  }
}
