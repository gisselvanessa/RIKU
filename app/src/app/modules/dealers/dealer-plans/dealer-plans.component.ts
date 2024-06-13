import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Plan } from 'src/app/interfaces/plan.interface';
import { UserDetails } from 'src/app/shared/models/user-details.model';
import { UserService } from 'src/app/shared/services/user.service';
import { BuyerOrdersService } from '../../buyers/buyer-orders/buyer-orders.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Error } from 'src/app/shared/models/error.model';
import { Order } from '../../buyers/buyer-orders/buyer-order.model';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { DealerOrdersService } from '../dealer-orders/dealer-orders.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dealer-plans',
  templateUrl: './dealer-plans.component.html',
  styleUrls: ['./dealer-plans.component.scss']
})
export class DealerPlansComponent implements OnInit {
  step = 1;
  userDetails: UserDetails;
  dni: any;
  loading: boolean = false;
  isDocumentUploading: boolean = false;
  isFormSubmitted: boolean = false;

  selectedPaymentMethod: string = 'card';
  isPaymentMethodSelected: boolean = false;
  isReceiptUploaded: boolean = false;
  isDocumentUploaded: boolean = false;
  receiptURL: any[] = [];

  profileForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    email: new FormControl(''),
    mobile: new FormControl(''),
    address: new FormControl(''),
  });
  @Input() currentOrder: Order = new Order();
  @Output() onSubmitDetails: EventEmitter<{ orderDetail: Order, nextStep: number }> = new EventEmitter();
  @Output() receiptSubmitted = new EventEmitter<any>();

  banckDetails: any = [ //datos quemados
    {
      bank_logo: '../../../../../assets/images/bank1.png',
      bank_name: "Banco Pichincha",
      type_account: "Corriente",
      account_number: "9500605400",
      account_name: "RIKU SA"
    },
    {
      bank_logo: '../../../../../assets/images/bank2.svg',
      bank_name: "Banco internacional",
      type_account: "Corriente",
      account_number: "48557510048",
      account_name: "RIKU SA"
    }
  ];
  plans: Plan[] = [
    // {
    //   name: 'Gratis',
    //   bgColor: '#EC8F67',
    //   characteristics: [
    //     {
    //       id: 1,
    //       name: '1 Mes de Publicación para tu vehículo'
    //     }
    //   ]
    // },
    {
      name: 'Estándar',
      price: '99,99',
      bgColor: '#9E438F',
      characteristics: [
        {
          id: 1,
          name: '1 Mes de Publicación para tu vehículo'
        }
      ]
    },
    {
      name: 'Recomendado',
      price: '399,99',
      bgColor: '#3C759A',
      characteristics: [
        {
          id: 2,
          name: '90 Días de Publicación para tu vehículo'
        }
      ]
    },
    {
      name: 'Plus',
      price: '699,99',
      bgColor: '#4E1F4F',
      characteristics: [
        {
          id: 3,
          name: '5 meses de Publicación para tu vehículo'
        }
      ]
    },
  ];
  constructor(private userService: UserService,
    private buyerOrdersService: BuyerOrdersService,
    private dealerOrdersService: DealerOrdersService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fileUploadService: FileUploadService,
    private modalService: NgbModal,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }
  next() {
    //console.log(this.basicDetailsForm);
    if (this.step == 1) {
      this.step++;
    } else if (this.step == 2) {
      this.step++;
    } 
    // else if (this.step == 3) {
    //   this.step++;
    // }
  }

  previous() {
    this.step--;
  }

  getUserInfo() {
    this.userService.getMyProfileDetails().subscribe((resp: any) => {
      this.userDetails = resp.data;
      this.profileForm.patchValue(this.userDetails);
      const fullAdrees =
        this.userDetails.address.address +
        ' ' +
        this.userDetails.address.city +
        ' ' +
        this.userDetails.address.province +
        ' ' +
        this.userDetails.address.parish;
      this.profileForm.controls['address'].setValue(fullAdrees);
      this.profileForm.controls['mobile'].setValue(this.userDetails.mobile_no.toString());
    });
  }
  selectPaymentMethod(e: any) {
    this.selectedPaymentMethod = e.target.value
  }
  confirm() {

    if (this.selectedPaymentMethod === 'cash') {
      this.isPaymentMethodSelected = true;
      this.next();
      // this.modalRef = this.modalService.open(this.openTermsOfCash, { size: 'lg', backdrop: 'static', centered: true })
    } else if (this.selectedPaymentMethod === 'card') {
      // this.sendUserForPaymentViaCard(this.selectedPaymentMethod);
    }
  }
  //this function is used to to-direct user to the stripe payment gateway for the card transaction
  private sendUserForPaymentViaCard(paymentType: string): void {
    this.loading = true;
    this.dealerOrdersService.makePayment('order', this.currentOrder.order_id).subscribe({
      next: (res: any) => {
        this.loading = false;
        window.location.href = res.data.url;
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
  public async onDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          this.toastr.error(this.translate.instant('File size must be smaller than 5 MB'));
          this.isDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'image/png' &&
          fileType != 'image/jpeg' &&
          fileType != 'application/pdf'
        ) {
          this.toastr.error(this.translate.instant('Allowed file type is only PDF, PNG and JPG'));
          return;
        }
        this.isDocumentUploading = true;
        await this.getPreSignedUrl(file).then((success) => {
          if (success) {
            if (index == files.length - 1) {
              this.isDocumentUploaded = true;
            }
          }
          index++;
        }).catch((error) => {
          return;
        });
      }
    }
  }

  //this functiojn is called when ROC Document, Legal Document or Prfile pucture change
  getPreSignedUrl(file: any) {
    this.isDocumentUploading = true;
    return new Promise((resolve, reject) => {
      let preSignedURL: any;
      preSignedURL = this.fileUploadService.getDealerDocPreSignedUrl({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        doc_type: 'ruc'
      });
      preSignedURL.subscribe(
        async (res: any) => {
          if (res.data.url && res.data.key) {
            await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe(() => {
              this.receiptURL.push({
                key: res.data.key,
                download_url: res.data.download_url
              });
              this.isDocumentUploading = false;
              resolve(true);
            }, () => {
              this.isDocumentUploading = false;
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
              reject(true);
            })
          }
        },
        (error: any) => {
          this.isDocumentUploading = false;
          if (error.error.error[0]) {
            this.toastr.error(error.error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      );
    });
  }
  //this function is used to update profile
  submitReceipt() {
    this.isFormSubmitted = true;
    if (!this.receiptURL.length) {
      return;
    }
    let userData = {
      // "order_id": this.currentOrder.order_id,
      "asset_key": this.receiptURL[0].key,
      "payment_method": this.selectedPaymentMethod
    };
    //agregado para que me redireccione por defecto
    const modalRef = this.modalService.open(SuccessfullComponent);
    modalRef.componentInstance.receiptUploaded = true;
    modalRef.componentInstance.order_id = this.currentOrder.order_id;
    modalRef.result.then(() => {
      // this.next();
    }).catch(() => {
      this.receiptSubmitted.emit(this.isReceiptUploaded=true);
      // this.next();  
    });
    // this.dealerOrdersService.submitBankReceipt(userData).pipe().subscribe({
    //   next: () => {
    //     const modalRef = this.modalService.open(SuccessfullComponent);
    //     modalRef.componentInstance.receiptUploaded = true;
    //     modalRef.componentInstance.order_id = this.currentOrder.order_id;
    //     modalRef.result.then(() => {
    // this.showPriceNegotiationStep();
    //     }).catch(() => {
    // this.showPriceNegotiationStep();
    //     }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
    //   },
    //   error: (errorRes: Error) => {
    //     const error = errorRes.error;
    //     if (error?.error?.length) {
    //       this.toastr.error(error.error[0]);
    //     } else {
    //       this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
    //     }
    //   }
    // });
  }
  //this function is used to dele Legal Document
  deleteLegalDocument(index: number) {
    this.receiptURL = [];
  }
  getFileType(url: string) {
    return getFileType(url);
  }
  resetPaymentMethod() {
    this.isPaymentMethodSelected = false;
    // this.completedStep = OrderStepsNumber.VEHICLE_REVIEW;
    this.isReceiptUploaded = false;
    this.previous();
    // this.timer(1);
  }
  back() {
    this.location.back()
  }
}
