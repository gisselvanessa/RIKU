import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Error } from 'src/app/shared/models/error.model';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminContentManagementService } from '../admin-content-management.service';
import { TranslateService } from '@ngx-translate/core';
import { ModulePermissions } from '../../permission.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  @ViewChild('brandsImages') brandsImages: ElementRef;
  @ViewChild('overviewImage') overviewImage: ElementRef;
  @ViewChild('uploadIcon') uploadIcon: ElementRef;
  @ViewChild('serviceIcon') serviceIcon: ElementRef;
  @ViewChild('uploadImage') uploadImage: ElementRef;



  @ViewChild('addServiceModal') addServiceModal: TemplateRef<any>;
  @ViewChild('addProcessModal') addProcessModal: TemplateRef<any>;

  openedSection: string = 'header';
  isOpened: boolean = true;
  loading: boolean = false;
  homePageImages: any = [];
  isImageUploaded: boolean = false;
  modalRef: any;

  homeForm: FormGroup;
  serviceForm: FormGroup;
  processForm: FormGroup;
  isFormSubmitted: boolean = false;
  isSubmitted: boolean = false;
  serviceList: Array<any> = [];
  maxCharactersSubTitle:any='250';
  maxCharactersTitle:any='50';
  buttonCharacters:any='30';
  processStepList: Array<any> = [];
  searchByList = [
    // {
    // name: 'Vehicle Type',
    // key: 'vehicle_type'
    // },
    {
      name: 'Search Model',
      key: 'model'
    }, {
      name: 'Location',
      key: 'location'
    }, {
      name: 'Price Range',
      key: 'price_range'
    }];
  selectedSearchBy: Array<any> = [
    // {
    //   key: 'vehicle_type',
    //   allow: false,
    // },
    {
      key: 'model',
      allow: false,
    }, {
      key: 'location',
      allow: false,
    }, {
      key: 'price_range',
      allow: false
    }];
  iconUrl: string | null;
  serviceIndex: number = -1;
  @Input() modulePermissions?: ModulePermissions;

  isPressedImage: boolean = true;
  imageUrl: string | null;

  // brands, services,process, overview
  constructor(private toastr: ToastrService, private fileUploadService: FileUploadService,
    private modalService: NgbModal, private translate: TranslateService, private adminContentService: AdminContentManagementService) { }

  ngOnInit(): void {
    this.createForm(null);
    this.getHomePageContent();
  }

  getHomePageContent() {
    this.adminContentService.homePageDetails().subscribe({
      next: (resp: any) => {
        this.createForm(resp.data);
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

  createForm(homePageDetails: any) {
    if (homePageDetails) {
      this.homeForm = new FormGroup({
        header: new FormGroup({
          title: new FormControl(homePageDetails.header?.title, [Validators.required]),
          sub_title: new FormControl(homePageDetails.header?.sub_title, [Validators.required]),
        }),
        brand: new FormGroup({
          title: new FormControl(homePageDetails.brand?.title, [Validators.required]),
          sub_title: new FormControl(homePageDetails.brand?.sub_title, [Validators.required]),
        }),
        eligibility: new FormGroup({
          title: new FormControl(homePageDetails.eligibility?.title, [Validators.required]),
          sub_title: new FormControl(homePageDetails.eligibility?.sub_title, [Validators.required]),
          button_text: new FormControl(homePageDetails.eligibility?.button_text, [Validators.required]),
        }),
        services: new FormGroup({
          title: new FormControl(homePageDetails.services?.title, [Validators.required]),
          sub_title: new FormControl(homePageDetails.services?.sub_title, [Validators.required]),
        }),
        process: new FormGroup({
          title: new FormControl(homePageDetails.process?.title, [Validators.required]),
          sub_title: new FormControl(homePageDetails.process?.sub_title, [Validators.required]),
        }),
        about_us: new FormGroup({
          title: new FormControl(homePageDetails.about_us?.title, [Validators.required]),
          sub_title: new FormControl(homePageDetails.about_us?.sub_title, [Validators.required]),
        }),
        overview: new FormGroup({
          title: new FormControl(homePageDetails.overview?.title, [Validators.required]),
          sub_title: new FormControl(homePageDetails.overview?.sub_title, [Validators.required]),
          button_text: new FormControl(homePageDetails.overview?.button_text, [Validators.required]),
        })
      });
    } else {
      this.homeForm = new FormGroup({
        header: new FormGroup({
          title: new FormControl('', [Validators.required]),
          sub_title: new FormControl('', [Validators.required]),
        }),
        brand: new FormGroup({
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
        about_us: new FormGroup({
          title: new FormControl('', [Validators.required]),
          sub_title: new FormControl('', [Validators.required]),
        }),
        overview: new FormGroup({
          title: new FormControl('', [Validators.required]),
          sub_title: new FormControl('', [Validators.required]),
          button_text: new FormControl('', [Validators.required]),
        })
      });
    }
    this.serviceForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      sub_title: new FormControl('', [Validators.required]),
      icon: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    });

    this.processForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      sub_title: new FormControl('', [Validators.required]),
      icon: new FormControl('', [Validators.required]),
    });

    if (homePageDetails) {
      if (homePageDetails.header.search_by) {
        // this.selectedSearchBy = homePageDetails.header.search_by;
        // const uniqueIds: any = [];
        // const unique:any = this.selectedSearchBy.filter((element: any) => {
        //   const isDuplicate = uniqueIds.includes(element.key);
        //   if (!isDuplicate) {
        //     uniqueIds.push(element.key);
        //     return true;
        //   }
        //   return false;
        // });
        this.selectedSearchBy.map((x) => x.allow = homePageDetails.header.search_by[x.key]);
      }
      this.homePageImages['brands'] = [];
      homePageDetails.brand.brands.forEach((item: any) => {
        this.homePageImages['brands'].push({
          icon: item.icon.key,
          download_url: item.icon.download_url,
          order: item.order
        });
      });
      this.serviceList = [];
      homePageDetails.services.services.forEach((item: any) => {
        this.serviceList.push({
          image: item.image.key,
          image_download_url: item.image.download_url,
          icon: item.icon.key,
          download_url: item.icon.download_url,
          title: item.title,
          sub_title: item.sub_title,
          order: item.order
        });
      });
      this.processStepList = [];
      homePageDetails.process.process.forEach((item: any) => {
        this.processStepList.push({
          icon: item.icon.key,
          download_url: item.icon.download_url,
          title: item.title,
          sub_title: item.sub_title,
          order: item.order
        });
      });
      this.homePageImages['overview'] = [];
      this.homePageImages['overview'][0] = homePageDetails.overview.icon;
      this.homePageImages['overview'][0].icon = homePageDetails.overview.icon.key;
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

  isSearchAllowed(searchBy: string): boolean {
    const index = this.selectedSearchBy.findIndex(x => x.key == searchBy);
    return index > -1 ? this.selectedSearchBy[index].allow : false;
  }

  setSearchValue(event: any, value: string) {
    const index = this.selectedSearchBy.findIndex(x => x.key == value);
    this.selectedSearchBy[index].allow = event.target.checked;
  }

  async onFileChange(event: any, sectionName: string) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      if (!this.homePageImages[sectionName]) {
        this.homePageImages[sectionName] = [];
      }
      // const totalDocuments = this.homePageImages[sectionName].length + files.length;
      // if (files.length > 10 || totalDocuments > 10) {
      //   this.toastr.warning('Maximum 10 documents are allowed!!');
      //   return;
      // }
      this.loading = true;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 10240) {
          this.toastr.error(this.translate.instant("File size must be smaller than 10 MB"));
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
          this.toastr.error(this.translate.instant("Allowed file type is only Images"));
          this.resetFileInput(sectionName);
          this.loading = false;
          return;
        }
        this.isImageUploaded = false;
        const isFileUploaded = await this.getPreSignedUrl(file, index, files.length, sectionName);
        if (isFileUploaded) {
          if (index == (files.length - 1)) {
            this.isImageUploaded = true;
            this.resetFileInput(sectionName);
            this.loading = false;
          } else if (index < (files.length - 1)) {
            index++;
          }
        } else if (index <= (files.length - 1) && !isFileUploaded) {
          this.isImageUploaded = false;
          this.resetFileInput(sectionName);
          this.loading = false;
          break;
        }
      }
    }
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
                    if (!this.homePageImages[sectionName]) {
                      this.homePageImages[sectionName] = [];
                    }
                    this.homePageImages[sectionName].push({
                      icon: res.data.key,
                      download_url: res.data.download_url,
                      order: this.homePageImages[sectionName].length + 1
                    });
                    resolve(true);
                  }
                }, (error: any) => {
                  this.loading = false;
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

  resetFileInput(sectionName: string) {
    switch (sectionName) {
      case 'brands':
        this.brandsImages.nativeElement.value = "";
        break;
      case 'overview':
        this.overviewImage.nativeElement.value = "";
        break;
      default:
        break;
    }
  }

  deleteDocument(index: number, sectionName: string) {
    this.homePageImages[sectionName].splice(index, 1);
  }

  savePageContent() {
    this.isFormSubmitted = true;
    if (this.homeForm.invalid) {
      this.toastr.warning(this.translate.instant('Please enter all required details!!'));
      return;
    }
    if (this.serviceList.length == 0) {
      this.toastr.warning(this.translate.instant('Please enter services!!'));
      return;
    }
    if (this.processStepList.length == 0) {
      this.toastr.warning(this.translate.instant('Please enter process steps!!'));
      return;
    }
    if (!this.homePageImages['brands'] || this.homePageImages['brands'].length == 0) {
      this.toastr.warning(this.translate.instant('Please upload brands images!!'));
      return;
    }
    if (!this.homePageImages['overview'] || this.homePageImages['overview'].length == 0) {
      this.toastr.warning(this.translate.instant('Please upload overview image!!'));
      return;
    }
    let homePageContent = { ...this.homeForm.value };
    let searchBy: any = {};
    this.selectedSearchBy.map((x) => searchBy[x.key] = x.allow);
    homePageContent.header.search_by = searchBy;
    homePageContent.brand.brands = [];
    this.homePageImages['brands'].map((x: any) => {
      homePageContent.brand.brands.push({ icon: x.icon, order: x.order });
    });

    homePageContent.services.services = [];
    this.serviceList.map((x: any) => {
      homePageContent.services.services.push({ icon: x.icon, order: x.order, title: x.title, sub_title: x.sub_title, image: x.image });
    });

    homePageContent.process.process = [];
    this.processStepList.map((x: any) => {
      homePageContent.process.process.push({ icon: x.icon, order: x.order, title: x.title, sub_title: x.sub_title });
    });
    homePageContent.overview.icon = this.homePageImages['overview'][this.homePageImages['overview'].length - 1].icon;
    this.adminContentService.saveHomePageContent(homePageContent).subscribe(
      (resp: any) => {
        this.toastr.success(this.translate.instant('Home Page Content Saved Successfully.'));
      },
      ({ error, status }) => {
        if (error) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }


  openModal(modalFor: string) {
    if (modalFor === 'service') {
      this.modalRef = this.modalService.open(this.addServiceModal, { size: 'md', backdrop: 'static', centered: true })
    } else {
      this.modalRef = this.modalService.open(this.addProcessModal, { size: 'md', backdrop: 'static', centered: true })
    }
  }

  addService() {
    this.isSubmitted = true;
    if (this.serviceForm.invalid) {
      return;
    }
    const data = { ...this.serviceForm.value };
    this.serviceList.push({ ...data, download_url: this.iconUrl, order: this.serviceList.length + 1, image_download_url: this.imageUrl
     });
    this.closeModal();
  }

  deleteService(index: number) {
    this.serviceList.splice(index, 1);
  }

  deleteProcess(index: number) {
    this.processStepList.splice(index, 1);
  }

  addProcess() {
    this.isSubmitted = true;
    if (this.processForm.invalid) {
      return;
    }
    const data = { ...this.processForm.value };
    this.processStepList.push({ ...data, download_url: this.iconUrl, order: this.processStepList.length + 1 });
    this.closeModal();
  }

  closeModal() {
    this.isSubmitted = false;
    this.iconUrl = null;
    this.serviceForm.reset();
    this.processForm.reset();
    this.modalRef.close();
  }

  setServiceData(event: any, fieldName: string, index: number) {
    if (event.target.value && event.target.value.trim() != '') {
      this.serviceList[index][fieldName] = event.target.value;
    }
  }

  setProcessData(event: any, fieldName: string, index: number) {
    if (event.target.value && event.target.value.trim() != '') {
      this.processStepList[index][fieldName] = event.target.value;
    }
  }

  async onFileInputChange(event: any, index: number = -1, sectionName: string = 'service') {
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
        if (sectionName == 'service') {
          if (index < 0) {
            if (this.isPressedImage) {
              this.serviceForm.get('image')?.setValue(uploadedFile.icon);
              this.imageUrl = uploadedFile.download_url;
            } else {
              this.serviceForm.get('icon')?.setValue(uploadedFile.icon);
              this.iconUrl = uploadedFile.download_url;
            }
            this.isPressedImage = false;
          } else {
            if (this.isPressedImage) {
              this.serviceList[index].image_download_url = uploadedFile.download_url;
              this.serviceList[index].image = uploadedFile.icon;
            } else {
              this.serviceList[index].download_url = uploadedFile.download_url;
              this.serviceList[index].icon = uploadedFile.icon;
            }
            this.isPressedImage = false;
            this.serviceIndex = -1;
          }
        } else {
          if (index < 0) {
            this.processForm.get('icon')?.setValue(uploadedFile.icon);
            this.iconUrl = uploadedFile.download_url;
          } else {
            this.processStepList[index].download_url = uploadedFile.download_url;
            this.processStepList[index].icon = uploadedFile.icon;
            this.serviceIndex = -1;
          }
        }
        this.isImageUploaded = true;
        this.loading = false;
        this.isPressedImage = false;
      }
    }
  }

  getName(key: string) {
    const name: any = this.searchByList.find(x => x.key == key)?.name
    return this.translate.instant(name);
  }
}
