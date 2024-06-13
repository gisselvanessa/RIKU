import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeleteDocumentDialogComponent } from 'src/app/shared/component/add-update-vehicle-procedure/delete-document-dialog/delete-document-dialog.component';
import { ExpertsService } from '../../../experts.service';
import { AccordianName } from '../../report.mode';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UploadSignatureDialogComponent } from '../upload-signature-dialog/upload-signature-dialog.component';


@Component({
  selector: 'app-comparison-table',
  templateUrl: './comparison-table.component.html',
  styleUrls: ['./comparison-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ComparisonTableComponent implements OnInit {

  @Input() page: string;
  @Input() appraisallDetails: any = {};
  @Output() saveData: EventEmitter<any> = new EventEmitter();
  @Input() selectAccordian: string;
  @Output() selectedAccordian: EventEmitter<any> = new EventEmitter();
  @Input() stepsCompleted: any;
  @Input() statusOfReview: string;
  @ViewChild('deleteConfirmation') deleteConfirmation: TemplateRef<any>;

  accordianName = AccordianName;
  accordianOpen = false;
  comparisonForm: FormGroup;
  comparisonFormData: any[] = [];
  commercialValueArr: any[] = [];
  commercialValue: any = 0.00;
  correctedAverageValue: any[] = [];
  approvedAverage: any = 0.00;
  sendComparisonData: any = {};
  isFormSubmitted = false;
  comparisonFormDataControls: any;
  vehicleYear: any[] = []
  brand: any[] = []
  zoneOfUse: any[] = []
  opportunityValue: any;
  additionalCriteria: any;
  isAdditionalAnnexUploading = false;
  additionalAnnexArray: any[] = [];
  additionalAnnexUrlArray: any[] = [];
  authSign: any;
  isSignDocumentUploading = false;
  modalRef: any;
  expertName: any;
  authSignKey: any;
  zoneOptions = [{ id: 'Mountain Range', value: 'Mountain Range' }, { id: 'Coast', value: 'Coast' }, { id: 'East', value: 'East' }]
  selectedZone: any;
  selectedZoneId: any;
  isSignatureUploaded: boolean = false;
  indexOfComparisonTable: number = -1;
  indexBooleanOfComparisonTable: any = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private location: Location,
    private fileUploadService: FileUploadService, private toastr: ToastrService,
    private expertService: ExpertsService, private translate: TranslateService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.expertName = localStorage.getItem('expert_name')
    if (this.page === 'add') {
      this.comparisonFormControls()
    }
    this.preDefinedValues()
  }

  selectZone(event: any, value: any) {
    this.selectedZoneId = event.target.value
    this.selectedZone = value
  }


  preDefinedValues() {
    if (this.appraisallDetails.vehicle_approval != null) {
      this.comparisonFormData = this.appraisallDetails.vehicle_approval.details;
      for (let i = 0; i < this.comparisonFormData.length; i++) {
        this.correctedAverageValue.push((Number(this.comparisonFormData[i].corrected_avg_value)))
      }
      this.commercialValue = Number(this.appraisallDetails.vehicle_approval.commercial_value);
      this.approvedAverage = Number(this.appraisallDetails.vehicle_approval.approved_avg);
    }
    if (this.appraisallDetails.security_approval != null) {
      this.approvedAverage = Number(this.appraisallDetails.security_approval.relational_value)
      this.opportunityValue = Number(this.appraisallDetails.security_approval.opportunity_value)
    }
    if (this.appraisallDetails.additional_criteria != null) {
      this.additionalCriteria = this.appraisallDetails.additional_criteria
    }
    if (this.appraisallDetails.additional_annex != null) {
      for (let i = 0; i < this.appraisallDetails.additional_annex.length; i++) {
        this.additionalAnnexArray.push(this.appraisallDetails.additional_annex[i].key)
        // this.additionalAnnexUrlArray.push(this.appraisallDetails.additional_annex[i].download_url)
      }
      this.appraisallDetails.additional_annex.forEach(async (annex: any, i: number) => {
        await new Promise<void>((resolve, reject) => {
          this.http.get(this.appraisallDetails.additional_annex[i].download_url, {
            observe: 'response',
            responseType: 'blob',
          }).subscribe({
            next: (res) => {
              resolve()
              var reader = new FileReader();
              const that = this;
              reader.onload = function (event) {
                that.additionalAnnexUrlArray.push(event.target?.result as any)
              };
              reader.readAsDataURL(res.body!);
            }
          })
        })
      })

    }

    if (this.appraisallDetails.auth_sign != null) {
      this.authSignKey = this.appraisallDetails.auth_sign.key
      // this.authSign = this.appraisallDetails.auth_sign.download_url
      this.http.get(this.appraisallDetails.auth_sign.download_url, {
        observe: 'response',
        responseType: 'blob',
      })
        .subscribe({
          next: async (res) => {
            var reader = new FileReader();
            const that = this;
            reader.onload = function (event) {
              that.authSign = event.target?.result as any;
            };
            reader.readAsDataURL(res.body!);
          },
        });

    }
  }

  comparisonFormControls() {
    this.comparisonForm = this.fb.group({
      brand: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', Validators.required],
      worth: ['', Validators.required],
      f_year: ['', [Validators.required, Validators.min(1), Validators.max(1.20)]],
      f_brand: ['', [Validators.required, Validators.min(0.90), Validators.max(1)]],
      zone_of_use: ['', Validators.required],
      f_area_of_use: ['', [Validators.required, Validators.min(0.90), Validators.max(1)]],
      corrected_avg_value: ['', Validators.required]
    })
    this.comparisonFormDataControls = this.comparisonForm.controls
  }

  selectedAccordians() {
    this.accordianOpen = !this.accordianOpen;
    const accordianName = this.accordianOpen ? this.accordianName.ComparisonTable : null;
    this.selectedAccordian.emit(accordianName)
  }

  addData() {
    const marketValue = parseFloat(this.comparisonForm.value.worth);
    const fYear = parseFloat(this.comparisonForm.value.f_year);
    const fBrand = parseFloat(this.comparisonForm.value.f_brand);
    const fAreaOfUse = parseFloat(this.comparisonForm.value.f_area_of_use);
    if (marketValue > 0 && fYear > 0 && fBrand > 0 && fAreaOfUse > 0) {
      // console.log('marketValue', marketValue);
      // console.log('fYear', fYear);
      // console.log('fBrand', fBrand);
      // console.log('fAreaOfUse', fAreaOfUse);

      const averageValue = (marketValue * fYear * fBrand * fAreaOfUse);
      this.comparisonForm.controls['corrected_avg_value'].setValue((averageValue).toString())
      if (this.indexBooleanOfComparisonTable) {
        this.correctedAverageValue[this.indexOfComparisonTable] = averageValue
        let totalApprovedAverage = 0;
        for (let i = 0; i < this.correctedAverageValue.length; i++) {
          totalApprovedAverage += this.correctedAverageValue[i]
        }
        this.approvedAverage = (totalApprovedAverage / this.correctedAverageValue.length)
      } else {
        this.correctedAverageValue.push(averageValue);
        let totalApprovedAverage = 0;
        for (let i = 0; i < this.correctedAverageValue.length; i++) {
          totalApprovedAverage += this.correctedAverageValue[i];
        }
        this.approvedAverage = (totalApprovedAverage / this.correctedAverageValue.length)
      }
      this.isFormSubmitted = true
      if (this.comparisonForm.invalid) {
        return;
      }
      if (this.comparisonFormData.length < 6) {
        if (this.indexBooleanOfComparisonTable) {
          this.comparisonFormData[this.indexOfComparisonTable] = this.comparisonForm.value
          this.comparisonFormData.forEach((element: any, index: any) => {
            element.samples = `Y${index + 1}`
          })
          this.commercialValueArr[this.indexOfComparisonTable] = (Number(marketValue));
          this.commercialValue = 0;
          for (let i = 0; i < this.commercialValueArr.length; i++) {
            this.commercialValue += this.commercialValueArr[i]
          }
        } else {
          this.comparisonFormData.push(this.comparisonForm.value)
          this.comparisonFormData.forEach((element: any, index: any) => {
            element.samples = `Y${index + 1}`
          })
          this.commercialValueArr.push(Number(marketValue));
          this.commercialValue = 0;
          for (let i = 0; i < this.commercialValueArr.length; i++) {
            this.commercialValue += this.commercialValueArr[i]
          }
        }
        this.commercialValue = (this.commercialValue / this.comparisonFormData.length)
        let vehicleYearData: any = {}
        let brandData: any = {}
        let zoneOfUseData: any = {}
        vehicleYearData.variable = this.comparisonForm.value.year
        vehicleYearData.factor = this.comparisonForm.value.f_year
        brandData.variable = this.comparisonForm.value.brand
        brandData.factor = this.comparisonForm.value.f_brand
        zoneOfUseData.variable = this.comparisonForm.value.zone_of_use
        zoneOfUseData.factor = this.comparisonForm.value.f_area_of_use
        if (this.indexBooleanOfComparisonTable) {
          this.vehicleYear[this.indexOfComparisonTable] = vehicleYearData
          this.brand[this.indexOfComparisonTable] = brandData
          this.zoneOfUse[this.indexOfComparisonTable] = zoneOfUseData
        } else {
          this.vehicleYear.push(vehicleYearData)
          this.brand.push(brandData)
          this.zoneOfUse.push(zoneOfUseData)
        }
        this.comparisonForm.reset()
        this.selectedZone = ''
        this.indexBooleanOfComparisonTable = false
        this.indexOfComparisonTable = -1;
        this.comparisonForm.clearValidators()
        this.isFormSubmitted = false;
      }
    } else {
      this.isFormSubmitted = true;
      return;
    }
  }

  editComparisonTable(index: number, compareData: any) {
    this.comparisonForm.controls['brand'].patchValue(compareData.brand)
    this.comparisonForm.controls['color'].patchValue(compareData.color)
    this.comparisonForm.controls['year'].patchValue(compareData.year)
    this.comparisonForm.controls['worth'].patchValue(compareData.worth)
    this.comparisonForm.controls['f_year'].patchValue(compareData.f_year)
    this.comparisonForm.controls['f_brand'].patchValue(compareData.f_brand)
    this.comparisonForm.controls['zone_of_use'].patchValue(compareData.zone_of_use)
    this.comparisonForm.controls['f_area_of_use'].patchValue(compareData.f_area_of_use)
    this.selectedZone = compareData.zone_of_use
    this.indexOfComparisonTable = index;
    this.indexBooleanOfComparisonTable = true;
    window.scrollTo(0, 1600)
  }

  deleteComparisonTable(index: number) {
    this.modalRef = this.modalService.open(this.deleteConfirmation, { windowClass:'delete-vehicle-modal', size: 'md', backdrop: 'static', centered: true });
    this.modalRef.result.then((result) => {
      if (result) {
        this.zoneOfUse.splice(index, 1)
        this.brand.splice(index, 1)
        this.vehicleYear.splice(index, 1)
        this.comparisonFormData.splice(index, 1)
        this.correctedAverageValue.splice(index, 1)
        let totalApprovedAverage = 0;
        for (let i = 0; i < this.correctedAverageValue.length; i++) {
         totalApprovedAverage += this.correctedAverageValue[i]
        }
        this.approvedAverage = (totalApprovedAverage / this.correctedAverageValue.length)
        this.commercialValueArr.splice(index, 1)
        let totalCommercialValue = 0;
        for (let i = 0; i < this.commercialValueArr.length; i++) {
          totalCommercialValue += this.commercialValueArr[i]
        }
        this.commercialValue = (totalCommercialValue / this.comparisonFormData.length)
      }
    })

  }

  formatNumber(event: any, field?: any) {
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replace(/,/g, '');
      value = parseFloat(value).toLocaleString('es');
      //value = Intl.NumberFormat('es').format(value)
      this.opportunityValue = value
    }
  }


  formatToNumber(event: any, field?: string) {
    if (event.target.value && event.target.value.trim() != '') {
      let value = event.target.value.replaceAll('.', '');
      value = value.replaceAll(',', '.');
      this.opportunityValue = value;
    }
  }
  async onFileChange(event: any, type: any) {
    let files = event.target.files;
    if (files) {
      const numberOfUploads =
        event.target.files.length + this.additionalAnnexUrlArray.length;
      if (numberOfUploads > 10) {
        this.toastr.error(this.translate.instant('Maximum 10 images are allowed to upload.'));
        return;
      }
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          this.toastr.error(this.translate.instant('File size must be smaller than 5 MB'));
          this.isAdditionalAnnexUploading = false;
          this.isSignDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'image/png' &&
          fileType != 'image/jpeg' &&
          fileType != 'application/pdf'
        ) {
          this.toastr.error(this.translate.instant('Allowed file type is only PDF, PNG'));
          return;
        }
        if (type == 'annex') {
          this.isAdditionalAnnexUploading = true;
        } else if (type == 'sign') {
          this.isSignDocumentUploading = true;
        }

        await this.getPreSignedUrl(file, type).then((success) => {
          if (success) {
            this.isAdditionalAnnexUploading = false;
            this.isSignDocumentUploading = false;
          }
        })
          .catch((error) => {
            this.isAdditionalAnnexUploading = false;
            this.isSignDocumentUploading = false;
            return;
          });
      }
    }
  }

  getPreSignedUrl(file: any, type: any) {
    return new Promise((resolve, reject) => {
      let preSignedURL: any;
      preSignedURL = this.expertService.getAdditionalAnnexPreSignedUrl({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });
      preSignedURL
        .subscribe(
          async (res: any) => {
            if (res.data.url && res.data.key) {
              this.expertService.uploadFile(res.data.url, file).pipe().subscribe({
                next: (resp: any) => {
                  if (type == 'annex') {
                    this.additionalAnnexArray.push(res.data.key)
                    this.additionalAnnexUrlArray.push(res.data.download_url)
                  } else if (type == 'sign') {
                    this.authSign = res.data.download_url
                    this.authSignKey = res.data.key;
                  }
                  resolve(true);
                }, error: () => {
                  this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
                  reject(true);
                }
              })
            }
          },
          (error: any) => {
            if (error.error.error[0]) {
              this.isAdditionalAnnexUploading = false
              this.isAdditionalAnnexUploading = false;
              this.toastr.error(error.error.error[0]);
            } else {
              this.isAdditionalAnnexUploading = false
              this.isAdditionalAnnexUploading = false;
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
            }
          }
        );

    });
  }

  public deleteDocument(i: any) {
    this.additionalAnnexUrlArray.splice(i, 1);
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


  saveComparisonData() {
    if (this.comparisonFormData.length < 4) {
      this.toastr.error(this.translate.instant('Minimum 4 samples are required in Comparison Table'))
    } else if (this.comparisonFormData.length >= 4) {
      this.sendComparisonData.vehicle_details = this.comparisonFormData;
      if (this.commercialValue) {
        this.sendComparisonData.commercial_value = this.commercialValue.toString();
        this.sendComparisonData.commercial_avg_value = this.commercialValue.toString();
      }
      if (this.approvedAverage) {
        this.sendComparisonData.approved_avg = this.approvedAverage.toString();
        this.sendComparisonData.relational_value = this.approvedAverage.toString();
      }
      if (this.opportunityValue) {
        this.sendComparisonData.opportunity_value = this.opportunityValue.toString();
      }
      this.sendComparisonData.vehicle_year = this.vehicleYear;
      this.sendComparisonData.brand = this.brand;
      this.sendComparisonData.zone_of_use = this.zoneOfUse;
      this.sendComparisonData.additional_criteria = this.additionalCriteria;
      this.sendComparisonData.additional_annex = this.additionalAnnexArray;
      this.sendComparisonData.auth_sign = this.authSignKey;
      this.sendComparisonData.current_step = 'VEHICLE_APPROVAL'
      this.saveData.emit(this.sendComparisonData);
    }

  }

  back() {
    this.location.back();
  }


  dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);
    //New Code
    return new Blob([ab], { type: mimeString });
  }



  uploadSign() {
    const modalRef = this.modalService.open(UploadSignatureDialogComponent, {
      windowClass: 'cancel-procedure-modal',
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    })
    modalRef.result.then(async (data: any) => {
      if (data && data.signKey) {
        const file: any = this.dataURItoBlob(data.signUrl);
        file['name'] = 'sign.png';
        this.isSignDocumentUploading = true;
        await this.getPreSignedUrl(file, 'sign').then((success) => {
          if (success) {
            this.isSignDocumentUploading = false;
          }
        }).catch((error) => {
          this.isSignDocumentUploading = false;
          return;
        });
      } else {
        this.isSignDocumentUploading = false;
      }
    }).catch((error: any) => {
      this.isSignDocumentUploading = false;
    });
  }

}
