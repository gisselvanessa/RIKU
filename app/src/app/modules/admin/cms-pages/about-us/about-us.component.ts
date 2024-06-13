import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { AdminContentManagementService } from '../admin-content-management.service';
import { ModulePermissions } from '../../permission.model';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  @ViewChild('addServiceModal') addServiceModal: TemplateRef<any>;
  @ViewChild('addProcessBuyModal') addProcessBuyModal: TemplateRef<any>;
  @ViewChild('addProcessSellModal') addProcessSellModal: TemplateRef<any>;

  @ViewChild('serviceIcon') serviceIcon: ElementRef;
  @ViewChild('uploadIcon') uploadIcon: ElementRef;
  @ViewChild('uploadImage') uploadImage: ElementRef;

  openedSection: string = 'header';
  isOpened: boolean = true;
  loading: boolean = false;
  aboutUsPageImages: any = [];
  isImageUploaded: boolean = false;
  modalRef: any;
  isSubmitted: boolean = false;
  serviceList: Array<any> = [];
  processStepBuyList: Array<any> = [];
  processStepSellList: Array<any> = [];

  aboutUsForm: FormGroup;
  serviceForm: FormGroup;
  textVisionForm: FormGroup;
  textMissionForm: FormGroup;
  processToBuyForm: FormGroup;
  processToSellForm: FormGroup;
  isFormSubmitted: boolean = false;
  textForm: FormGroup;
  iconUrl: string | null;
  serviceIndex: number = -1;
  @Input() modulePermissions?: ModulePermissions;

  maxCharactersSubTitle:any='250';
  maxCharactersTitle:any='50';
  buttonCharacters:any='30';

  constructor(private toastr: ToastrService, private fileUploadService: FileUploadService,
    private modalService: NgbModal, private translate: TranslateService, private adminContentService: AdminContentManagementService) { }

  ngOnInit(): void {
    this.createForm(null)
    this.getAboutUsContent()
  }

  createForm(aboutUsDetails: any) {
    if (aboutUsDetails) {
      this.aboutUsForm = new FormGroup({
        header: new FormGroup({
          title: new FormControl(aboutUsDetails.header?.title, [Validators.required]),
          sub_title: new FormControl(aboutUsDetails.header?.sub_title, [Validators.required]),
        }),
        eligibility: new FormGroup({
          title: new FormControl(aboutUsDetails.eligibility?.title, [Validators.required]),
          sub_title: new FormControl(aboutUsDetails.eligibility?.sub_title, [Validators.required]),
          button_text: new FormControl(aboutUsDetails.eligibility?.button_text, [Validators.required]),
        }),
        services: new FormGroup({
          title: new FormControl(aboutUsDetails.services?.title, [Validators.required]),
          sub_title: new FormControl(aboutUsDetails.services?.sub_title, [Validators.required]),
        }),
        process: new FormGroup({
          title: new FormControl(aboutUsDetails.process?.title, [Validators.required]),
          sub_title: new FormControl(aboutUsDetails.process?.sub_title, [Validators.required]),
        }),
      });
      this.serviceList = [];
      aboutUsDetails.services.services.forEach((item: any) => {
        this.serviceList.push({
          title: item.title,
          sub_title: item.sub_title,
          order: item.order
        });
      });
      this.textMissionForm = new FormGroup({
        title: new FormControl(aboutUsDetails.text.mission.title, [Validators.required]),
        sub_title: new FormControl(aboutUsDetails.text.mission.sub_title, [Validators.required]),
      })
      this.textVisionForm = new FormGroup({
        title: new FormControl(aboutUsDetails.text.vision.title, [Validators.required]),
        sub_title: new FormControl(aboutUsDetails.text.vision.sub_title, [Validators.required]),
      })

      this.processStepBuyList = [];
      aboutUsDetails.process.to_buy.forEach((item: any) => {
        this.processStepBuyList.push({
          icon: item.icon.key,
          download_url: item.icon.download_url,
          title: item.title,
          sub_title: item.sub_title,
          order: item.order
        });
      });
      this.processStepSellList = [];
      aboutUsDetails.process.to_sell.forEach((item: any) => {
        this.processStepSellList.push({
          icon: item.icon.key,
          download_url: item.icon.download_url,
          title: item.title,
          sub_title: item.sub_title,
          order: item.order
        });
      });

    } else {
      this.aboutUsForm = new FormGroup({
        header: new FormGroup({
          title: new FormControl('', [Validators.required]),
          sub_title: new FormControl('', [Validators.required]),
        }),

        eligibility: new FormGroup({
          title: new FormControl('', [Validators.required]),
          sub_title: new FormControl('', [Validators.required]),
          button_text: new FormControl('', [Validators.required]),
        }),
        services: new FormGroup({
          title: new FormControl('', [Validators.required]),
          sub_title: new FormControl('', [Validators.required]),
        }),
        process: new FormGroup({
          title: new FormControl('', [Validators.required]),
          sub_title: new FormControl('', [Validators.required]),
        }),
      });
      this.serviceForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        sub_title: new FormControl('', [Validators.required]),
      });

      this.processToBuyForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        sub_title: new FormControl('', [Validators.required]),
        icon: new FormControl('', [Validators.required]),
      });
      this.processToSellForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        sub_title: new FormControl('', [Validators.required]),
        icon: new FormControl('', [Validators.required]),
      });

      this.textVisionForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        sub_title: new FormControl('', [Validators.required]),
      })
      this.textMissionForm = new FormGroup({
        title: new FormControl('', [Validators.required]),
        sub_title: new FormControl('', [Validators.required]),
      })

    }



  }



  showHideSection(section: string) {
    if (this.openedSection == section) {
      this.isOpened = !this.isOpened;
      return;
    }
    this.isOpened = true;
    this.openedSection = section;
  }

  getAboutUsContent() {
    this.adminContentService.aboutUsPage().subscribe({
      next: (resp: any) => {
        // this.homePageDetails = resp.data ? resp.data : {};
        this.createForm(resp.data);
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        this.loading = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    })
  }



  async getPreSignedUrl(file: any, index: number, totalFiles: number, sectionName: string = '') {
    try {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this.fileUploadService
          .getHomePageImagesPreSignedUrl({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size
          })
          .subscribe(
            async (res: any) => {
              if (res.data.url && res.data.key) {
                await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe((data) => {
                  this.loading = false;
                  if (sectionName == '') {
                    resolve({
                      icon: res.data.key,
                      download_url: res.data.download_url,
                    });
                  } else {
                    if (!this.aboutUsPageImages[sectionName]) {
                      this.aboutUsPageImages[sectionName] = [];
                    }
                    this.aboutUsPageImages[sectionName].push({
                      icon: res.data.key,
                      download_url: res.data.download_url,
                      order: this.aboutUsPageImages[sectionName].length + 1
                    });
                    resolve(true);
                  }
                }, (error: any) => {
                  this.loading = false;
                  this.toastr.error(this.translate.instant('Allowed file type is only Images'));
                  reject(false);
                })
              }
            },
            (errorRes: Error) => {
              const error = errorRes.error;
              if (error.error[0]) {
                this.toastr.error(error.error[0]);
              } else {
                this.toastr.error(this.translate.instant('Allowed file type is only Images'));
              }
            }
          );
      });
    } catch (ex) {
    }
  }

  savePageContent() {
    this.isFormSubmitted = true;
    if (this.aboutUsForm.invalid) {
      this.toastr.warning(this.translate.instant('Please enter all required details!!'));
      return;
    }
    if (this.serviceList.length == 0) {
      this.toastr.warning(this.translate.instant('Please enter services!!'));
      return;
    }
    if (this.processStepBuyList.length == 0) {
      this.toastr.warning(this.translate.instant('Please enter Buy process steps!!'));
      return;
    }
    if (this.processStepSellList.length == 0) {
      this.toastr.warning(this.translate.instant('Please enter Sell process steps!!'));
      return;
    }
    let aboutUsPageContent = { ...this.aboutUsForm.value };
    aboutUsPageContent.text = {}
    aboutUsPageContent.text.mission = { title: this.textMissionForm.value.title, sub_title: this.textMissionForm.value.sub_title }
    aboutUsPageContent.text.vision = { title: this.textVisionForm.value.title, sub_title: this.textVisionForm.value.sub_title }
    aboutUsPageContent.services.services = [];
    this.serviceList.map((x: any) => {
      aboutUsPageContent.services.services.push({ icon: x.icon, order: x.order, title: x.title, sub_title: x.sub_title });
    });

    aboutUsPageContent.process.to_buy = [];
    this.processStepBuyList.map((x: any) => {
      aboutUsPageContent.process.to_buy.push({ icon: x.icon, order: x.order, title: x.title, sub_title: x.sub_title });
    });

    aboutUsPageContent.process.to_sell = [];
    this.processStepSellList.map((x: any) => {
      aboutUsPageContent.process.to_sell.push({ icon: x.icon, order: x.order, title: x.title, sub_title: x.sub_title });
    });

    this.adminContentService.postAboutUsPage(aboutUsPageContent).subscribe({
      next: (resp: any) => {
        if (resp) {
          this.toastr.success(this.translate.instant('About Us Content Added Successfully'));
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
    })
  }


  openModal(modalFor: string) {
    if (modalFor === 'service') {
      this.modalRef = this.modalService.open(this.addServiceModal, { size: 'md', backdrop: 'static', centered: true })
    } else if (modalFor === 'process_buy') {
      this.modalRef = this.modalService.open(this.addProcessBuyModal, { size: 'md', backdrop: 'static', centered: true })
    } else if (modalFor === 'process_sell') {
      this.modalRef = this.modalService.open(this.addProcessSellModal, { size: 'md', backdrop: 'static', centered: true })
    }
  }

  addService() {
    this.isSubmitted = true;
    if (this.serviceForm.invalid) {
      return;
    }
    const data = { ...this.serviceForm.value };
    this.serviceList.push({ ...data, order: this.serviceList.length + 1 });
    this.closeModal();
  }

  deleteService(index: number) {
    this.serviceList.splice(index, 1);
  }

  deleteProcess(index: number, type: any) {
    if (type == 'buy') {
      this.processStepBuyList.splice(index, 1);
    } else if (type == 'sell') {
      this.processStepSellList.splice(index, 1);
    }
  }

  addProcess(type: any) {
    if (type == 'sell') {
      this.isSubmitted = true;
      if (this.processToSellForm.invalid) {
        return;
      }
      const data = { ...this.processToSellForm.value };
      this.processStepSellList.push({ ...data, download_url: this.iconUrl, order: this.processStepSellList.length + 1 });
      this.closeModal();
    } else if (type == 'buy') {
      this.isSubmitted = true;
      if (this.processToBuyForm.invalid) {
        return;
      }
      const data = { ...this.processToBuyForm.value };
      this.processStepBuyList.push({ ...data, download_url: this.iconUrl, order: this.processStepBuyList.length + 1 });
      this.closeModal();
    }

  }

  closeModal() {
    this.isSubmitted = false;
    this.iconUrl = null;
    this.serviceForm.reset();
    this.processToBuyForm.reset();
    this.processToSellForm.reset();
    this.modalRef.close();
  }

  setServiceData(event: any, fieldName: string, index: number) {
    if (event.target.value && event.target.value.trim() != '') {
      this.serviceList[index][fieldName] = event.target.value;
    }
  }

  setProcessData(event: any, fieldName: string, index: number, type: any) {
    if (type == 'process_buy') {
      if (event.target.value && event.target.value.trim() != '') {
        this.processStepBuyList[index][fieldName] = event.target.value;
      }
    } else if (type == 'process_sell') {
      if (event.target.value && event.target.value.trim() != '') {
        this.processStepSellList[index][fieldName] = event.target.value;
      }
    }
  }


  changeImageIcon(index: number) {
    this.serviceIndex = index;
    this.serviceIcon.nativeElement.click();
  }

  async onFileInputChange(event: any, index: number = -1, sectionName: string = 'process_buy') {
    let files = event.target.files;
    if (files) {
      const file = files[0];
      const totalBytes = file.size;
      const fileSize = Math.round(totalBytes / 1024);
      if (fileSize >= 10240) {
        this.toastr.error(this.translate.instant('File size must be smaller than 10 MB'));
        this.isImageUploaded = false;
        this.loading = false;
        return;
      }
      const fileType = file.type;
      if (
        fileType != 'image/png' &&
        fileType != 'image/jpeg' &&
        fileType != 'image/gif' && fileType != 'image/svg+xml'
      ) {
        this.toastr.error(this.translate.instant('Allowed file type is only Images'));
        this.uploadIcon.nativeElement.value = '';
        this.uploadImage.nativeElement.value = '';
        this.loading = false;
        return;
      }
      this.isImageUploaded = false;
      const uploadedFile: any = await this.getPreSignedUrl(file, 0, files.length);
      if (uploadedFile) {
        if (sectionName == 'process_buy') {
          if (index < 0) {
            this.processToBuyForm.get('icon')?.setValue(uploadedFile.icon);
            this.iconUrl = uploadedFile.download_url;
          } else {
            this.processStepBuyList[index].download_url = uploadedFile.download_url;
            this.processStepBuyList[index].icon = uploadedFile.icon;
            this.serviceIndex = -1;
          }
        } else if (sectionName == 'process_sell') {
          if (index < 0) {
            this.processToSellForm.get('icon')?.setValue(uploadedFile.icon);
            this.iconUrl = uploadedFile.download_url;
          } else {
            this.processStepSellList[index].download_url = uploadedFile.download_url;
            this.processStepSellList[index].icon = uploadedFile.icon;
            this.serviceIndex = -1;
          }
        }
        this.isImageUploaded = true;
        this.loading = false;
      }
    }
  }
}
