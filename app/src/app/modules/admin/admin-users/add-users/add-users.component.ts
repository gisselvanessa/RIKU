import { Component, OnInit, ViewEncapsulation, ViewChild, NgZone, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SpaceValidator  } from 'src/app/shared/validators';
import { AdminUsersService } from '../admin-users.service';
import {
  CountryISO,
  PhoneNumberFormat, SearchCountryField
} from 'ngx-intl-tel-input';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { CustomSpecialCharValidators } from 'src/app/shared/helpers/validators';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { Error } from 'src/app/shared/models/error.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddUsersComponent implements OnInit, AfterViewInit {

  userType: string;
  personalInfoForm: FormGroup;
  otherDetails: FormGroup;
  personalInfoFormControls: any;
  vehicleTypes:any=['cars', 'commercial_vehicles']
  isFormSubmitted: boolean = false;
  today = new Date();
  currentStep: number = 1;
  selectedVehicleTypes: Array<string> = [];
  additionalAddressText: string;
  userId: string;
  separateDialCode = false;
  searchCountryField = SearchCountryField;
  countryISO = CountryISO;
  phoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.Ecuador
  ];
  isProfileImageUploading: boolean = false;
  isRUCDocumentUploading: boolean = false;
  isLegalDocumentUploading: boolean = false;
  dealerRUCDocuments: Array<any> = [];
  dealerLegalDocuments: Array<any> = [];
  profileImageURL: string | null;
  selectedVehicleConditions: Array<string> = [];
  availableUserNameList: Array<string> = [];
  isUserNameDisabled: boolean = true;
  userNameList = [];

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
    private adminUsersService: AdminUsersService,
    private fileUploadService: FileUploadService, private modalService: NgbModal, private translate: TranslateService) {
  }

  @ViewChild('additionalAddress') additionalAddress: any;
  @ViewChild('otherAddress') otherAddress: any;

  @ViewChild('myTypeDrop') dropdown: any;
  @ViewChild('profilePhotoInput') profileImageInput: ElementRef;
  @ViewChild('rucDocument') rucDocument: ElementRef;
  @ViewChild('legalDocument') legalDocument: ElementRef;


  ngOnInit(): void {
    this.today.setFullYear(new Date().getFullYear() - 18);
    this.getProvinceData();
    this.createForm();
  }

  ngAfterViewInit(): void {
    this.__getGoogleAddress();
    this.__setDealerOptionalAddress();
  }

  formatNumber(event: any) {
    let current: string = event.target.value;
    current = current.replace(/[^\d-+ ]/g, '');
    this.personalInfoFormControls['mobile_no'].setValue(current);
  }

  createForm() {
    try {
      this.personalInfoForm = this.fb.group(
        {
          type: ['', [Validators.required]],
          first_name: ['', [Validators.required, Validators.minLength(3),
            // SpaceValidator.cannotContainSpace,
            CustomSpecialCharValidators.specialCharValidator]],
          last_name: ['', [Validators.required, Validators.minLength(3),
            // SpaceValidator.cannotContainSpace,
            CustomSpecialCharValidators.specialCharValidator]],
          user_name: ['', []],
          company_name: [''],
          vehicle_condition: ['new'],
          vehicle_types: [this.vehicleTypes],
          email: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/), SpaceValidator.cannotContainSpace]],
          dob: [''],
          mobile_no: ['', [Validators.required]],
          gender: ['', [Validators.required]],
          additional_address: ['', [Validators.required]],
          city: ['', [Validators.required]],
          province: ['', [Validators.required]],
          ruc_doc: [''],
          legal_doc: [''],
          other_address: [''],
          profile_img: [''],
          parish: [
            '',
            [
              Validators.required
            ],
          ],
        }
      );

      this.personalInfoForm.get('type')?.valueChanges.subscribe(val => {
        if (val == 'dealer') {
          this.personalInfoForm.controls['company_name'].setValidators([Validators.required]);
          this.personalInfoForm.controls['vehicle_condition'].setValidators([Validators.required]);
          this.personalInfoForm.controls['vehicle_types'].setValidators([Validators.required]);
          this.personalInfoForm.controls['ruc_doc'].setValidators([Validators.required]);
          this.personalInfoForm.controls['legal_doc'].setValidators([Validators.required]);
          this.personalInfoForm.controls['gender'].clearValidators();
          this.personalInfoForm.controls['dob'].clearValidators();
        } else {
          if (val == 'seller') {
            this.personalInfoForm.controls['vehicle_types'].setValidators([Validators.required]);
          }
          this.personalInfoForm.controls['dob'].setValidators([Validators.required]);
          this.personalInfoForm.controls['gender'].setValidators([Validators.required]);
          this.personalInfoForm.controls['company_name'].clearValidators();
          this.personalInfoForm.controls['vehicle_condition'].clearValidators();
          this.personalInfoForm.controls['vehicle_types'].clearValidators();
          this.personalInfoForm.controls['ruc_doc'].clearValidators();
          this.personalInfoForm.controls['legal_doc'].clearValidators();
        }
        this.personalInfoForm.controls['dob'].updateValueAndValidity();
        this.personalInfoForm.controls['gender'].updateValueAndValidity();
        this.personalInfoForm.controls['company_name'].updateValueAndValidity();
        this.personalInfoForm.controls['vehicle_condition'].updateValueAndValidity();
        this.personalInfoForm.controls['vehicle_types'].updateValueAndValidity();
        this.personalInfoForm.controls['ruc_doc'].updateValueAndValidity();
        this.personalInfoForm.controls['legal_doc'].updateValueAndValidity();
      });
      this.personalInfoFormControls = this.personalInfoForm.controls;
    } catch (error) {
    }
  }

  getUserNameList() {
    try {
      if (this.userType != 'dealer') {
        let firstName = this.personalInfoFormControls['first_name'].value;
        let lastName = this.personalInfoFormControls['last_name'].value;
        if (firstName && lastName) {
          this.adminUsersService.getSuggestedUserNames({ first_name: firstName.trim(), last_name: lastName.trim() })
            .pipe()
            .subscribe((res: any) => {
              this.userNameList = res.data;
              this.dropdown.open();
              this.checkUserExist();
            }, (error) => {
              this.personalInfoFormControls['user_name'].setValue(null);
            })
        }
      }
    } catch (error) {
    }
  }

  setUserName(username: any) {
    console.log(username)
    if (this.userType == 'dealer') {
      this.personalInfoFormControls['user_name'].setValue(username.target.value);
    } else {
      this.personalInfoFormControls['user_name'].setValue(username);
    }
  }

  checkUserExist() {
    try {
      let email = this.personalInfoFormControls['email'].value;
      let mobile_no: any;
      let country_code: any;
      if (this.personalInfoFormControls['mobile_no'].value) {
        let mobileNo = this.personalInfoFormControls['mobile_no'].value;
        country_code = mobileNo.dialCode;
        let mobileNum = mobileNo.number.includes(country_code) ? mobileNo.number.replace(country_code, "") : mobileNo.number;
        mobile_no = mobileNum.replaceAll(/\s/g, '');
      }
      if (email && country_code && mobile_no) {
        this.adminUsersService.checkUserExist({ email: email, mobile_no: mobile_no, country_code: country_code })
          .pipe()
          .subscribe((res: any) => {
            if (res.data?.roles?.length > 0) {
              this.personalInfoFormControls['user_name'].setValue(null);
              // if(res.data.roles.includes('dealer')){
              //   this.personalInfoFormControls['user_name'].setValue(null);
              //   this.toastr.error('This user is already registered as dealer');
              // }else{
              //   this.personalInfoFormControls['user_name'].setValue(res.data.userName);
              // }
            }
          }, (error) => {
            this.personalInfoFormControls['user_name'].setValue(null);
          })
      }
    } catch (error) {
      // console.log('error', error);
    }
  }

  private __getGoogleAddress() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.additionalAddress?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.fillInAddress(autocomplete.getPlace(), true);
      });
    });
  }

  public __setDealerOptionalAddress() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.otherAddress?.nativeElement, {
      componentRestrictions: { country: ["ec"] },
      fields: ["address_components"],
      types: ["address"],
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.fillInAddress(autocomplete.getPlace(), false);
      });
    });
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
              //this.personalInfoFormControls['parish'].setValue(parish);
            }
            break;
          case "sublocality":
            parish = component.long_name;
            if (isAddress) {
              //this.personalInfoFormControls['parish'].setValue(parish);
            }
            break;
          case "locality":
            city = component.long_name;
            if (isAddress) {
              //this.personalInfoFormControls['city'].setValue(city);
            }
            break;
          case "administrative_area_level_1":
            // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            province = component.long_name;
            if (isAddress) {
              //this.personalInfoFormControls['province'].setValue(province);
            }
            break;
          case "administrative_area_level_2":
            province = component.long_name;
            if (isAddress) {
              //this.personalInfoFormControls['province'].setValue(province);
            }
            break;
          case "political":
            province = component.long_name;
            if (isAddress) {
              //this.personalInfoFormControls['province'].setValue(province);
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
      isAddress ? this.personalInfoForm.controls['additional_address'].setValue(address1) : this.personalInfoForm.controls['other_address'].setValue(address1);
    } catch (ex) {
    }
  }

  setUserType(userType: string) {
    this.userType = userType;
    this.isFormSubmitted = false;
    if (this.userType === 'dealer') {
      this.personalInfoForm.reset();
      this.personalInfoFormControls['type'].setValue(userType);
    } else {
      this.currentStep = 1;
      this.personalInfoFormControls['type'].setValue(userType);
    }
  }

  setGender(gender: string) {
    this.personalInfoFormControls['gender'].setValue(gender);
  }

  setVehicleCondition(vehicleCondition: string) {
    if (this.selectedVehicleConditions.includes(vehicleCondition)) {
      this.selectedVehicleConditions.splice(this.selectedVehicleConditions.indexOf(vehicleCondition), 1)
    } else {
      this.selectedVehicleConditions.push(vehicleCondition);
    }
    this.personalInfoFormControls['vehicle_condition'].setValue(this.selectedVehicleConditions);
  }

  // setVehicleTypes(vehicleType: string) {
  //   if (this.selectedVehicleTypes.includes(vehicleType)) {
  //     this.selectedVehicleTypes.splice(this.selectedVehicleTypes.indexOf(vehicleType), 1)
  //   } else {
  //     this.selectedVehicleTypes.push(vehicleType);
  //   }
  //   this.personalInfoFormControls['vehicle_types'].setValue(this.selectedVehicleTypes);
  // }

  addUpdateUser() {
    try {
      this.isSubmitted = true;
      this.isFormSubmitted = true;
      if (this.dealerLegalDocuments.length > 0 && this.dealerRUCDocuments.length > 0) {
        this.personalInfoFormControls['ruc_doc'].setValue(this.dealerRUCDocuments.map(value => value.key));
        this.personalInfoFormControls['legal_doc'].setValue(this.dealerLegalDocuments.map(value => value.key));
      }

      if(this.userType == 'seller' || this.userType == 'dealer'){
        this.personalInfoForm.controls['vehicle_types'].setValue(this.vehicleTypes)
      }
      if (this.personalInfoForm.invalid) {
        return;
      }
      const userData = { ...this.personalInfoForm.value };
      const date = new Date(userData.dob);
      userData.country_code = userData.mobile_no.dialCode.trim();
      userData.mobile_no = userData.mobile_no.number.includes(userData.country_code) ? userData.mobile_no.number.replace(userData.country_code, "") : userData.mobile_no.number;
      userData.mobile_no = userData.mobile_no.replaceAll(/\s/g, '').trim();
      userData.address = {
        province: userData.province,
        city: userData.city,
        parish: userData.parish,
        address: userData.additional_address
      };
      userData.is_agreed = true;
      if (this.userType == 'buyer') {
        delete userData.vehicle_types;
      }
      if (this.userType != 'dealer') {
        userData.dob = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate())).slice(-2);
        delete userData.vehicle_condition;
        delete userData.company_name;
        delete userData.ruc_doc;
        delete userData.legal_doc;
        delete userData.other_address;
      } else {
        if (this.dealerLegalDocuments.length == 0 || this.dealerRUCDocuments.length == 0) {
          this.toastr.warning(this.translate.instant('Please upload RUC and Legal Documents!!'));
          return;
        } else {
          userData.ruc_doc = this.dealerRUCDocuments.map(value => value.key);
          userData.legal_doc = this.dealerLegalDocuments.map(value => value.key);
        }
        if (userData.other_address && userData.other_address.trim() != '') {
          userData.additional_address = userData.other_address;
        }
        delete userData.dob;
        delete userData.other_address;
      }
      if (!this.profileImageURL) {
        delete userData.profile_img;
      }
      delete userData.province;
      delete userData.city;
      delete userData.parish;

      this.adminUsersService.addUser(userData)
        .pipe()
        .subscribe((response: any) => {
          this.isFormSubmitted = false;
          this.personalInfoForm.reset();
          this.toastr.success(response.message);
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'add-user-modal ',
          });
          modalRef.componentInstance.addUserSuccess = true;
          modalRef.componentInstance.addUserSuccessBtnText = "Back to User Management";
        },
          ({ error, status }) => {
            if (error.error[0]) {
              const errorMessage = error.error_code == 'USER_ALREADY_EXISTS' ? `User already exists` : error.error[0];
              this.toastr.error(this.translate.instant(errorMessage));
            } else {
              const message = this.translate.instant('Something Went Wrong Please Try again later')
              this.toastr.error(message);
            }
          });
    } catch (error) {
      //console.log('error', error);
    }
  }

  changeStep() {
    if (this.currentStep == 1) {
      this.isFormSubmitted = true;
      if (this.personalInfoFormControls['first_name'].invalid ||
        this.personalInfoFormControls['last_name'].invalid ||
        this.personalInfoFormControls['email'].invalid ||
        this.personalInfoFormControls['mobile_no'].invalid) {
        return;
      }
      this.currentStep++;
      this.isFormSubmitted = false;
      setTimeout(() => {
        this.__getGoogleAddress();
        this.__setDealerOptionalAddress();
      }, 1000);
    } else {
      this.currentStep--;
    }
  }

  onProfilePhotoChange(event: any) {
    if (event.target.files.length > 0) {
      const totalBytes = event.target.files[0].size;
      const fileSize = Math.round(totalBytes / 1024);
      if (fileSize >= 5120) {
        const message = this.translate.instant('Image size must be smaller than 5 MB')
        this.toastr.error(message);
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.isProfileImageUploading = true;
        this.getPreSignedUrl(event.target.files[0], 'profile').then((res) => {
          this.isProfileImageUploading = false;
          this.profileImageInput.nativeElement.value = '';
        }).catch((error) => {
          this.isProfileImageUploading = false;
          this.profileImageInput.nativeElement.value = '';
          return;
        });
      };
    }
  }

  deleteProfilePhoto() {
    this.profileImageURL = null;
    this.profileImageInput.nativeElement.value = '';
    this.personalInfoFormControls['profile_img'].setValue(null);
  }

  public async onRUCDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 10240) {
          const message = this.translate.instant('File size must be smaller than 10 MB')
          this.toastr.error(message);
          this.isRUCDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'application/pdf'
        ) {
          const message = this.translate.instant('Allowed file type is only PDF')
          this.toastr.error(message);
          return;
        }
        this.isRUCDocumentUploading = true;
        await this.getPreSignedUrl(file, 'ruc', index, files.length)
          .then((success) => {
            if (success) {
              if (index == files.length - 1) {
                this.rucDocument.nativeElement.value = '';
                this.isRUCDocumentUploading = false;
              }
            }
            index++;
          })
          .catch((error) => {
            this.isRUCDocumentUploading = false;
            this.rucDocument.nativeElement.value = '';
            return;
          });
      }
    }
  }

  public async onLegalDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 10240) {
          this.toastr.error(this.translate.instant('File size must be smaller than 10 MB'));
          this.isLegalDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'application/pdf'
        ) {
          this.toastr.error(this.translate.instant('Allowed file type is only PDF'));
          return;
        }
        this.isLegalDocumentUploading = true;
        await this.getPreSignedUrl(file, 'legal', index, files.length)
          .then((success) => {
            if (success) {
              if (index == files.length - 1) {
                this.isLegalDocumentUploading = false;
                this.legalDocument.nativeElement.value = '';
              }
            }
            index++;
          })
          .catch((error) => {
            this.isLegalDocumentUploading = false;
            this.legalDocument.nativeElement.value = '';
            return;
          });
      }
    }
  }

  deleteRUCDocument(index: number) {
    this.dealerRUCDocuments.splice(index, 1);
  }

  deleteLegalDocument(index: number) {
    this.dealerLegalDocuments.splice(index, 1);
  }

  async getPreSignedUrl(
    file: any,
    inputName: string = 'ruc',
    index = 0,
    totalFiles = 0
  ) {
    try {
      return new Promise((resolve, reject) => {
        let preSignedURL: any;
        if (inputName == 'profile') {
          preSignedURL = this.fileUploadService
            .getProfilePicPreSignedUrl({
              file_name: file.name,
              file_type: file.type,
              file_size: file.size
            });
        } else {
          preSignedURL = this.fileUploadService
            .getDealerDocPreSignedUrl({
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              doc_type: inputName
            });
        }
        preSignedURL
          .subscribe(
            async (res: any) => {
              if (res.data.url && res.data.key) {
                await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe((data) => {
                  if (inputName == 'profile') {
                    this.isProfileImageUploading = false;
                    this.personalInfoFormControls['profile_img'].setValue(res.data.key);
                    this.profileImageURL = res.data.download_url;
                  } else if (inputName == 'legal') {
                    this.dealerLegalDocuments.push({
                      key: res.data.key,
                      src: res.data.download_url
                    });
                  } else {
                    this.dealerRUCDocuments.push({
                      key: res.data.key,
                      src: res.data.download_url
                    });
                  }
                  resolve(true);
                }, (error) => {
                  this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
                  reject(true);
                })
              }
            },
            (errorRes: Error) => {
              const error = errorRes.error;
              if (error.error[0]) {
                this.toastr.error(this.translate.instant(error.error[0]));
              } else {
                this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
              }
            }
          );
      });
    } catch (ex) { }

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
    this.personalInfoForm.controls['province'].setValue(province)
    this.searchProvince = '';
    this.parishList = [];
    this.personalInfoForm.controls['city'].setValue('');
    this.personalInfoForm.controls['parish'].setValue('');
    this.adminUsersService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.personalInfoForm.controls['city'].setValue(city);
    this.personalInfoForm.controls['parish'].setValue('');
    this.searchCity = '';
    this.adminUsersService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.personalInfoForm.controls['parish'].setValue(parish);
    this.searchParish = '';
  }

  getProvinceData(){
    this.adminUsersService.getProvinceList().subscribe((resp: any) => {
      this.provinceList = resp.data;
    });
  }
}
