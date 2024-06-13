import { Component, OnInit, ViewEncapsulation, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SpaceValidator, EmailMatchValidator } from 'src/app/shared/validators';
import {
  CountryISO,
  PhoneNumberFormat, SearchCountryField
} from 'ngx-intl-tel-input';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { CustomSpecialCharValidators } from 'src/app/shared/helpers/validators';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { Error } from 'src/app/shared/models/error.model';
import { ManageExpertsService } from '../manage-experts.service';
import { ModuleName, ModulePermissions } from '../../permission.model';
import { Location } from '@angular/common';
import { ActivateDeactivateComponent } from '../../admin-users/activate-deactivate/activate-deactivate.component';
import { PostAPIResponse } from '../../../../shared/models/post-api-response.model';
import { GetExpertResponse, ExpertUserDetails } from '../manage-experts.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add-update-expert',
  templateUrl: './add-update-expert.component.html',
  styleUrls: ['./add-update-expert.component.scss']
})

export class AddUpdateExpertComponent implements OnInit, AfterViewInit {
  expertInfoForm: FormGroup;
  expertDetail: ExpertUserDetails;
  expertInfoFormControls: any;
  isFormSubmitted: boolean = false;
  today = new Date();
  currentStep: number = 1;
  additionalAddressText: string;
  expertId: string;
  separateDialCode = false;
  searchCountryField = SearchCountryField;
  countryISO = CountryISO;
  phoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.Ecuador
  ];
  isProfileImageUpdating: boolean = false;
  isDocumentUploading: boolean = false;
  profileImageURL: string | null;

  expertDocuments: Array<{ key: string, download_url: string }> = [];
  originalDocuments: Array<{ key: string, download_url: string }> = []
  loading: boolean = false;
  latitude: number;
  longitude: number;
  deletedDocuments: Array<string> = [];
  modulePermissions: ModulePermissions = {} as ModulePermissions;
  savingDetail: boolean = false;
  googleAddress: string;
  isProfileImageRemoving: boolean = false;
  provinceList: string[] = [];
  cityList:  string[] = [];
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  parishList:  string[] = [];
  isSubmitted: boolean = false;

  constructor(
    public router: Router, private toastr: ToastrService,
    private fb: FormBuilder, private ngZone: NgZone,
    private expertsService: ManageExpertsService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private fileUploadService: FileUploadService, private translate: TranslateService, private modalService: NgbModal) {
  }

  @ViewChild('additionalAddress') additionalAddress: any;
  @ViewChild('myTypeDrop') dropdown: any;

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.ExpertManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
    this.getProvinceData();
    this.createForm();
  }

  goback() {
    this.location.back()
  }

  ngAfterViewInit(): void {
    if (!this.expertId) {
      this.__getGoogleAddress();
    }
  }

  formatNumber(event: any) {
    let current: string = event.target.value;
    current = current.replace(/[^\d-+ ]/g, '');
    this.expertInfoFormControls['mobile_no'].setValue(current);
  }

  createForm() {
    try {
      this.expertInfoForm = this.fb.group(
        {
          first_name: ['', [Validators.required, Validators.minLength(3),
            //  SpaceValidator.cannotContainSpace,
             CustomSpecialCharValidators.specialCharValidator]],
          last_name: ['', [Validators.required, Validators.minLength(3),
            // SpaceValidator.cannotContainSpace,
            CustomSpecialCharValidators.specialCharValidator]],
          email: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/), SpaceValidator.cannotContainSpace]],
          mobile_no: ['', [Validators.required]],
          expert_code: ['', [Validators.required, Validators.minLength(4)]],
          // code_num_system: ['', [Validators.required, Validators.minLength(4)]],
          gender: ['', [Validators.required]],
          additional_address: ['', [Validators.required]],
          city: ['', [Validators.required]],
          province: ['', [Validators.required]],
          parish: [
            '',
            [
              Validators.required
            ],
          ],
          docs: [''],
          profile_img: ['']
        }
      );
      this.expertInfoFormControls = this.expertInfoForm.controls;
      this.getExpertDetails();
    } catch (error) {
    }
  }

  getExpertDetails() {
    try {
      this.expertId = this.activatedRoute.snapshot.paramMap.get('id') || '';
      if (this.expertId && this.expertId != '') {
        this.loading = true;
        this.expertsService.getExpertUserDetails(this.expertId).pipe().subscribe((response: GetExpertResponse) => {
          this.loading = false;
          this.setFormValues(response.data);
          this.expertDetail = response.data;
          setTimeout(() => {
            this.__getGoogleAddress();
          }, 1000);
        }, (error: Error) => {
          this.loading = false;
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
          this.router.navigate(['/admin/experts']);
        });
      }
    } catch (error) {
    }
  }


  setFormValues(expertDetail: any) {
    this.expertInfoFormControls['first_name'].patchValue(expertDetail.first_name);
    this.expertInfoFormControls['last_name'].patchValue(expertDetail.last_name);
    this.expertInfoFormControls['email'].patchValue(expertDetail.email);
    this.expertInfoFormControls['mobile_no'].patchValue(expertDetail.country_code + ' ' + expertDetail.mobile_no);
    this.expertInfoFormControls['additional_address'].patchValue(expertDetail.address?.address);
    this.expertInfoFormControls['province'].patchValue(expertDetail.address?.province);
    this.expertInfoFormControls['city'].patchValue(expertDetail.address?.city);
    this.expertInfoFormControls['parish'].patchValue(expertDetail.address?.parish);
    this.expertInfoFormControls['gender'].patchValue(expertDetail.gender);
    this.expertInfoFormControls['expert_code'].patchValue(expertDetail.expert_code);
    // this.expertInfoFormControls['code_num_system'].patchValue(expertDetail.code_num_system);
    this.latitude = expertDetail.address?.lat;
    this.longitude = expertDetail.address?.lng;
    this.googleAddress = expertDetail.address?.address;
    this.expertDocuments = expertDetail?.documents ? expertDetail?.documents : [];
    this.originalDocuments = expertDetail?.documents.map((x: any) => x.key);
    if (expertDetail.profile_img_url) {
      this.profileImageURL = expertDetail.profile_img_url;
    }


    this.setProvice(expertDetail.address?.province);
    this.expertInfoFormControls['city'].setValue(
      expertDetail.address?.city
    );
    this.setCity(expertDetail.address?.city);
    this.expertInfoFormControls['parish'].setValue(
      expertDetail.address?.parish
    );
    this.setParish(expertDetail.address?.parish);

    // this.expertInfoForm.get('email')?.disable();
    // this.expertInfoForm.get('mobile_no')?.disable();
  }

  private __getGoogleAddress() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.additionalAddress?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components", "formatted_address", "geometry", "name"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: any = autocomplete.getPlace();
        this.latitude = place.geometry['location'].lat();
        this.longitude = place.geometry['location'].lng();
        this.fillInAddress(place, true);
      });
    });
  }

  changeStatus(event: any) {
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'change-expert-status--modal'
    })
    modalRef.componentInstance.expertId = this.expertId;
    const message = this.translate.instant("Back to Expert Edit")
    modalRef.componentInstance.changeSuccessBtnText = message;
    modalRef.componentInstance.expertStatus = this.expertDetail.is_active
    modalRef.componentInstance.active = event.target.checked;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'cancel' || resp === 0) {
        event.target.checked = !event.target.checked;
        this.expertDetail.is_active = event.target.checked ? true : false;
      } else if (resp === 'confirm') {
        this.getExpertDetails()
      }
    })
  }

  deleteExpert() {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.expertId = this.expertId
    const message = this.translate.instant("Back to Expert Listing")
    modalRef.componentInstance.deleteSuccessBtnText = message;
  }


  public fillInAddress(place: any, isAddress: boolean = false) {
    try {
      //Reference Url:  https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
      let address1 = "";
      let province = '';
      let city = '';
      let parish = '';
      let country = '';
      for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
        const componentType = component.types[0];
        switch (componentType) {
          case "street_address": {
            address1 += `${component.long_name}`;
            break;
          }
          case "point_of_interest": {
            address1 += `${component.long_name}`;
            break;
          }
          case "establishment": {
            address1 += `${component.long_name}`;
            break;
          }
          case "street_number": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "route": {
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          }
          case "sublocality_level_3":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_2":
            address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            break;
          case "sublocality_level_1":
            parish = component.long_name;
            if (isAddress) {
              //this.expertInfoFormControls['parish'].setValue(parish);
            }
            break;
          case "sublocality":
            parish = component.long_name;
            if (isAddress) {
              //this.expertInfoFormControls['parish'].setValue(parish);
            }
            break;
          case "locality":
            city = component.long_name;
            if (isAddress) {
              //this.expertInfoFormControls['city'].setValue(city);
            }
            break;
          case "administrative_area_level_1":
            // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            province = component.long_name;
            if (isAddress) {
              //this.expertInfoFormControls['province'].setValue(province);
            }
            break;
          case "administrative_area_level_2":
            province = component.long_name;
            if (isAddress) {
              //this.expertInfoFormControls['province'].setValue(province);
            }
            break;
          case "political":
            province = component.long_name;
            if (isAddress) {
              //this.expertInfoFormControls['province'].setValue(province);
            }
            break;
          case "country":
            if (isAddress) {
              country = component.long_name;
            }
            break;
        }
      }
      if (parish != '') {
        address1 += ',' + parish;
      }
      if (city != '') {
        address1 += ',' + city;
      }
      if (province != '') {
        address1 += ',' + province;
      }
      if (country != '') {
        address1 += ',' + country;
      }
      this.googleAddress = place.formatted_address;
      isAddress ? this.expertInfoForm.controls['additional_address'].setValue(place.formatted_address) : "";
    } catch (ex) {
    }
  }


  setGender(gender: string) {
    this.expertInfoFormControls['gender'].setValue(gender);
  }

  addUpdateExpert() {
    try {
      this.isSubmitted = true;
      this.isFormSubmitted = true;
      if (this.expertInfoForm.invalid) {
        return;
      }
      // if (!this.googleAddress || this.expertInfoForm.value.additional_address.toLowerCase().includes(this.googleAddress.toLowerCase()) == false) {
      //   this.toastr.warning('Please enter valid address!!');
      //   return;
      // }
      // if (!this.latitude || !this.longitude) {
      //   this.toastr.warning('Please enter valid address!!');
      //   return;
      // }
      if (this.expertDocuments.length > 0) {
        this.expertInfoFormControls['docs'].setValue(this.expertDocuments.map(value => value.key));
      } else {
        const message = this.translate.instant("Please upload documents!!")
        this.toastr.warning(message);
        return;
      }
      const userData = { ...this.expertInfoForm.value };
      userData.country_code = userData.mobile_no.dialCode.trim();
      userData.mobile_no = userData.mobile_no.number.includes(userData.country_code) ? userData.mobile_no.number.replace(userData.country_code, "") : userData.mobile_no.number;
      userData.mobile_no = userData.mobile_no.replaceAll(/\s/g, '').trim();
      userData.address = {
        province: userData.province,
        city: userData.city,
        parish: userData.parish,
        address: userData.additional_address
      };
      if (!this.profileImageURL) {
        delete userData.profile_img;
      } else {
        userData.profile_img = this.profileImageURL.slice(this.profileImageURL.indexOf("user"));
      }
      if (this.expertDocuments.length == 0) {
        delete userData.docs;
        userData.new_docs ? delete userData.new_docs : null;
      }
      if (this.expertId) {
        userData.user_id = this.expertId;
        if (userData.docs?.length > 0 && this.originalDocuments != userData.docs) {
          userData.docs = userData.docs.filter((x: any) => !this.originalDocuments.includes(x));
          if (userData.docs.length > 0) {
            userData.new_docs = userData.docs;
          }
        } else {
          userData.new_docs = userData.docs;
        }
        if (this.deletedDocuments.length > 0) {
          userData.deleted_docs = this.deletedDocuments
        }
        userData.docs ? delete userData.docs : undefined;
      }
      delete userData.province;
      delete userData.city;
      delete userData.parish;
      if (this.latitude && this.longitude) {
        userData.lat = this.latitude;
        userData.lng = this.longitude;
      }
      this.loading = true;
      const addUpdateExpert = this.expertId ? this.expertsService.updateExpert(userData) : this.expertsService.addExpert(userData);
      this.savingDetail = true;
      addUpdateExpert.pipe()
        .subscribe({
          next: (res: PostAPIResponse) => {
            this.savingDetail = false;
            this.isFormSubmitted = false;
            this.expertInfoForm.reset();
            const modalRef = this.modalService.open(SuccessfullComponent, {
              windowClass: 'add-expert-modal ',
            });
            if (this.expertId) {
              modalRef.componentInstance.expertUpdated = true;
            } else {
              modalRef.componentInstance.expertAdded = true;
            }
          },
          error: (errorRes: Error) => {
            this.savingDetail = false;
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
    } catch (error) {
    }
  }

  onProfilePhotoChange(event: any) {
    if (event.target.files.length > 0) {
      const totalBytes = event.target.files[0].size;
      const fileSize = Math.round(totalBytes / 1024);
      if (fileSize >= 5120) {
        const message = this.translate.instant("Image size must be smaller than 5 MB")
        this.toastr.error(message);
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.isProfileImageUpdating = false;
        this.getPreSignedUrl(event.target.files[0], 'profile').then((res) => {
          this.isProfileImageUpdating = false;
        }).catch((error) => {
          this.isProfileImageUpdating = false;
          return;
        });
      };
    }
  }

  deleteProfilePhoto() {
    this.profileImageURL = null;
    this.expertInfoFormControls['profile_img'].setValue(null);
  }

  public async onDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      const totalDocuments = this.expertDocuments.length + files.length;
      if (totalDocuments > 10) {

        const message = this.translate.instant("Maximum 10 documents are allowed!!")
        this.toastr.warning(message);
        return;
      }
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 10240) {
          const message = this.translate.instant("File size must be smaller than 10 MB")
          this.toastr.error(message);
          this.isDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'image/png' &&
          fileType != 'image/jpeg' &&
          fileType != 'image/gif' &&
          fileType != 'application/pdf' &&
          fileType != 'application/x-abiword' &&
          fileType != 'application/msword' &&
          fileType != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          const message = this.translate.instant("Allowed file type is only PDF, PNG")
          this.toastr.error(message);
          return;
        }
        this.isDocumentUploading = true;
        const isFileUploaded = await this.getPreSignedUrl(file, 'document', index, files.length);
        if (isFileUploaded) {
          if (index == (files.length - 1)) {
            this.isDocumentUploading = false;
          } else if (index < (files.length - 1)) {
            index++;
          }
        } else if (index <= (files.length - 1) && !isFileUploaded) {
          this.isDocumentUploading = false;
          break;
        }
      }
    }
  }

  deleteDocument(index: number) {
    this.deletedDocuments.push(this.expertDocuments[index].key);
    this.expertDocuments.splice(index, 1);
  }

  async getPreSignedUrl(
    file: any,
    inputName: string = 'document',
    index = 0,
    totalFiles = 0
  ) {
    try {
      return new Promise((resolve, reject) => {
        const presignAPI = inputName === 'profile' ? this.fileUploadService
          .getProfilePicPreSignedUrl({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size
          }) : this.fileUploadService
            .getExpertDocPreSignedUrl({
              file_name: file.name,
              file_type: file.type,
              file_size: file.size
            })
        presignAPI.subscribe(
          async (res: any) => {
            if (res.data.url && res.data.key) {
              await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe((data) => {
                if (inputName == 'profile') {
                  this.expertInfoFormControls['profile_img'].setValue(res.data.key);
                  this.profileImageURL = res.data.download_url;
                  resolve(true);
                } else {
                  this.expertDocuments.push({
                    key: res.data.key,
                    download_url: res.data.download_url
                  });
                  resolve(true);
                }
              }, (error) => {
                const message = this.translate.instant("Something Went Wrong Please Try again later")
                this.toastr.error(message);
                reject(true);
              })
            }
          },
          (errorRes: Error) => {
            const error = errorRes.error;
            if (error.error[0]) {
              this.toastr.error(error.error[0]);
            } else {
              const message = this.translate.instant("Something Went Wrong Please Try again later")
              this.toastr.error(message);
            }
          }
        );
      });
    } catch (ex) {
    }
  }

  getFileType(url: string) {
    return getFileType(url);
  }

  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }


  setProvice(province: string) {
    this.expertInfoFormControls['province'].setValue(province)
    this.searchProvince = '';
    this.parishList = [];
    this.expertInfoFormControls['city'].setValue('');
    this.expertInfoFormControls['parish'].setValue('');
    this.expertsService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.expertInfoFormControls['city'].setValue(city);
    this.expertInfoFormControls['parish'].setValue('');
    this.searchCity = '';
    this.expertsService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.expertInfoFormControls['parish'].setValue(parish);
    this.searchParish = '';
  }

  getProvinceData(){
    this.expertsService.getProvinceList().subscribe((resp: any) => {
      this.provinceList = resp.data;
    });
  }
}


