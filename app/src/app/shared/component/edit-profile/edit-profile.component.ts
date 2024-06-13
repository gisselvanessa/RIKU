import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpaceValidator } from 'src/app/shared/validators';
import { EditProfileService } from './edit-profile.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { User } from '../../models/user.model';
import { Location } from '@angular/common';
import { getFileType } from 'src/app/shared/helpers/file-helper';

import { ChangePasswordComponent } from '../../modals/change-password/change-password.component';
import { SuccessfullComponent } from '../../modals/successfull/successfull.component';
import { UserService } from '../../services/user.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Error } from '../../models/error.model';
import { SetParams } from '../../helpers/set-params';
import { ChangeEmailAndMobileComponent } from '../../modals/change-email-and-mobile/change-email-and-mobile.component';
import { OtpVerificationEditProfileComponent } from '../../modals/otp-verification-edit-profile/otp-verification-edit-profile.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent implements OnInit {

  @Input() userType: string = '';
  displayUserType:any;

  personalInfoFormControls: any;
  isFormSubmitted: boolean = false;
  today = new Date();
  currentStep: number = 1;
  additionalAddressText: string;
  userId: string;
  separateDialCode: boolean = false;
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
  availableUserNameList: Array<string> = [];
  selectedVehicleConditions: Array<string> = [];
  selectedVehicleTypes: Array<string> = [];
  isUserNameDisabled: boolean = true;
  deletedUserId: string;
  userNameList = [];

  personalInfoForm: FormGroup;
  otherDetails: FormGroup;
  userDetails: any;
  public imageSrcForProfile: string = '';
  public imageSrcForRucDoc: any[] = [];
  public imageSrcForLegalDoc: any[] = [];
  public isPhotoRemove: boolean = false;
  provinceList: string[] = [];
  cityList:  string[] = [];
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  parishList:  string[] = [];
  isSubmitted: boolean = false;

  //this variable is used when email or number is changing
  editProfileOTP: any;
  currentProfilePicURL: string | null;
  currentEmail: string;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private editProfileService: EditProfileService,
    public location: Location,
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private modalService: NgbModal,
    private translate: TranslateService
  ) { }

  @ViewChild('myTypeDrop') dropdown: any;
  @ViewChild('additionalAddress') additionalAddress: any;
  @ViewChild('otherAddress') otherAddress: any;

  ngOnInit(): void {
    this.getProvinceData();
    this.createForm();
    this.getProfileDetails();
  }

  //set google api's after view init
  ngAfterViewInit(): void {
    // this.__getGoogleAddress();
    // if (this.userType === 'dealer') {
    //   this.__setDealerOptionalAddress();
    // }
  }

  setGoogleAutoComplete(){
    this.__getGoogleAddress();
    if (this.userType === 'dealer') {
      this.__setDealerOptionalAddress();
    }
  }

  // this function is used to create form and set validation on the behalf of usertype
  createForm() {
    this.personalInfoForm = this.fb.group({
      type: [this.userType],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      user_name: [],
      company_name: [],
      vehicle_condition: [],
      vehicle_types: [],
      email: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/), SpaceValidator.cannotContainSpace]],
      dob: [],
      mobile_no: [{ value: null, readonly: true }, Validators.required],
      mobile_no1: [{ value: null, readonly: true }, Validators.required],
      gender: ['', Validators.required],
      additional_address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      ruc_doc: [],
      legal_doc: [],
      other_address: [],
      profile_img: [],
      parish: ['', Validators.required],
    });
    if (this.userType == 'dealer') {
      this.personalInfoForm.controls['company_name'].setValidators([Validators.required]);
      this.personalInfoForm.controls['vehicle_condition'].setValidators([Validators.required]);
      this.personalInfoForm.controls['vehicle_types'].setValidators([Validators.required]);
      this.personalInfoForm.controls['ruc_doc'].setValidators([Validators.required]);
      this.personalInfoForm.controls['legal_doc'].setValidators([Validators.required]);
      this.personalInfoForm.controls['gender'].clearValidators();
      this.personalInfoForm.controls['dob'].clearValidators();
    } else {
      this.personalInfoForm.controls['dob'].setValidators([Validators.required]);
      this.personalInfoForm.controls['gender'].setValidators([Validators.required]);
      this.personalInfoForm.controls['company_name'].clearValidators();
      this.personalInfoForm.controls['vehicle_condition'].clearValidators();
      this.personalInfoForm.controls['vehicle_types'].clearValidators();
      this.personalInfoForm.controls['ruc_doc'].clearValidators();
      this.personalInfoForm.controls['legal_doc'].clearValidators();
      if (this.userType == 'seller') {
        this.personalInfoForm.controls['vehicle_types'].setValidators([Validators.required]);
      }
    }
    this.personalInfoForm.controls['dob'].updateValueAndValidity();
    this.personalInfoForm.controls['gender'].updateValueAndValidity();
    this.personalInfoForm.controls['company_name'].updateValueAndValidity();
    this.personalInfoForm.controls['vehicle_condition'].updateValueAndValidity();
    this.personalInfoForm.controls['vehicle_types'].updateValueAndValidity();
    this.personalInfoForm.controls['ruc_doc'].updateValueAndValidity();
    this.personalInfoForm.controls['legal_doc'].updateValueAndValidity();

    this.personalInfoFormControls = this.personalInfoForm.controls;
  }


  //this function is used to set username on the behalf of company name
  setUserName(username: any) {
    if (this.userType == 'dealer') {
      this.personalInfoFormControls['user_name'].setValue(username.target.value);
    } else {
      this.personalInfoFormControls['user_name'].setValue(username);
    }
  }

  //this function is used to patch form value
  setFormValues(userDetail: User) {
    const date = new Date(userDetail?.dob);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.personalInfoForm.patchValue({
      first_name: userDetail?.first_name,
      last_name: userDetail?.last_name,
      email: userDetail?.email,
      mobile_no: userDetail?.country_code + ' ' + userDetail?.mobile_no,
      additional_address: userDetail?.address?.address,
      province: userDetail?.address?.province,
      city: userDetail?.address?.city,
      parish: userDetail?.address?.parish,
      gender: userDetail?.gender,
      dob: today,
      other_address: userDetail?.additional_address,
      vehicle_types: userDetail?.vehicle_types,
      user_name: userDetail?.user_name,
    })
    if (this.userType == 'dealer') {
      this.personalInfoForm.patchValue({
        company_name: userDetail?.company_name,
        vehicle_condition: userDetail?.vehicle_condition,
        legal_doc: userDetail?.legal_doc,
        ruc_doc: userDetail?.ruc_doc,
      })
      this.selectedVehicleConditions = userDetail.vehicle_condition ? userDetail?.vehicle_condition : [];
      this.dealerLegalDocuments = userDetail?.legal_doc ? userDetail?.legal_doc : [];
      this.dealerRUCDocuments = userDetail?.ruc_doc ? userDetail?.ruc_doc : [];
    }

    this.selectedVehicleTypes = userDetail?.vehicle_types ? userDetail.vehicle_types : [];
    if (userDetail?.profile_pic && userDetail.profile_pic.download_url) {
      this.profileImageURL = userDetail.profile_pic.download_url ? userDetail.profile_pic.download_url : null;
      this.currentProfilePicURL = userDetail.profile_pic.download_url ? userDetail.profile_pic.download_url : null;
      this.personalInfoFormControls['profile_img'].patchValue(userDetail.profile_pic.key);
    }
    this.currentEmail = userDetail.email;
    this.personalInfoForm.get('mobile_no1')?.setValue(this.personalInfoForm.value.mobile_no)
    this.personalInfoForm.get('mobile_no1')?.disable();

    this.setProvice(userDetail.address?.province);
    this.personalInfoFormControls['city'].setValue(
      userDetail.address?.city
    );
    this.setCity(userDetail.address?.city);
    this.personalInfoFormControls['parish'].setValue(
      userDetail.address?.parish
    );
    this.setParish(userDetail.address?.parish);
  }

  //this function is called when when vechicle condition in forms
  setVehicleCondition(vehicleCondition: string) {
    if (this.selectedVehicleConditions.includes(vehicleCondition)) {
      this.selectedVehicleConditions.splice(this.selectedVehicleConditions.indexOf(vehicleCondition), 1)
    } else {
      this.selectedVehicleConditions.push(vehicleCondition);
    }
    this.personalInfoFormControls['vehicle_condition'].setValue(this.selectedVehicleConditions);
  }

  //this function is called when when vechicle type in forms
  setVehicleTypes(vehicleType: string) {
    if (this.selectedVehicleTypes.includes(vehicleType)) {
      this.selectedVehicleTypes.splice(this.selectedVehicleTypes.indexOf(vehicleType), 1)
    } else {
      this.selectedVehicleTypes.push(vehicleType);
    }
    this.personalInfoFormControls['vehicle_types'].setValue(this.selectedVehicleTypes);
  }

  // when user is get username list when user is buyer or seller. not applicable for dealer
  getUserNameList() {
    if (this.userType === 'seller' || this.userType === 'buyer') {
      let firstName = this.personalInfoFormControls['first_name'].value;
      let lastName = this.personalInfoFormControls['last_name'].value;
      if (firstName && lastName) {
        this.editProfileService.getSuggestedUserNames({ first_name: firstName.trim(), last_name: lastName.trim() })
          .pipe().subscribe({
            next: (res: any) => {
              this.userNameList = res.data;
              this.dropdown.open();
              this.checkUserExist();
            },
            error: () => {
              this.personalInfoFormControls['user_name'].setValue(null);
            }
          });
      }
    }
  }

  //this function is used to check the selected username is matched with existing or not
  checkUserExist() {
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
      this.editProfileService.checkUserExist({ email: email, mobile_no: mobile_no, country_code: country_code })
        .pipe().subscribe({
          next: (res: any) => {
            // if(res.data?.roles?.length > 0){
            //   this.personalInfoFormControls['user_name'].setValue(null);
            // }
          },
          error: () => {
            this.personalInfoFormControls['user_name'].setValue(null);
          }
        });
    }
  }

  // this funtion is used to set form value for address
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

  // this funtion is used to set form value for additional address
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
  }

  //this function is used to set gender
  setGender(gender: string) {
    this.personalInfoFormControls['gender'].setValue(gender);
  }

  //this function is used to update profile
  updateUser() {
    this.isSubmitted = true;
    this.isFormSubmitted = true;
    this.personalInfoForm.markAllAsTouched();
    if (this.dealerLegalDocuments.length > 0 && this.dealerRUCDocuments.length > 0) {
      this.personalInfoFormControls['ruc_doc'].setValue(this.dealerRUCDocuments.map(value => value.key));
      this.personalInfoFormControls['legal_doc'].setValue(this.dealerLegalDocuments.map(value => value.key));
    }


    let userData = { ...this.personalInfoForm.value };
    if (this.personalInfoForm.invalid) {
      this.toastr.error(this.translate.instant('Please fill all required details!!'));
      return;
    }
    userData.country_code = userData.mobile_no.dialCode;
    userData.mobile_no = userData.mobile_no.number.includes(userData.country_code) ? userData.mobile_no.number.replace(userData.country_code, "") : userData.mobile_no.number;
    userData.mobile_no = userData.mobile_no.trim();
    userData.address = {
      province: userData.province,
      city: userData.city,
      parish: userData.parish,
      address: userData.additional_address
    };
    userData.additional_address = userData.other_address;
    const additional_address = userData.other_address;
    delete userData.other_address;
    delete userData.province;
    delete userData.city;
    delete userData.parish;
    if (userData?.dob) {
      const date = new Date(userData.dob);
      userData.dob = ("0" + (date.getDate())).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    }

    if (this.userType == 'buyer') {
      delete userData.vehicle_types;
    }
    userData = SetParams.setParams(userData);
    userData.additional_address = additional_address ? additional_address : '';
    this.editProfileService.updateUser(userData).pipe().subscribe({
      next: (resp) => {
        this.isFormSubmitted = false;
        if(resp.data.profile_img_url && this.currentProfilePicURL != resp.data.profile_img_url && this.profileImageURL){
          this.userService.setUserProfileImage(resp.data.profile_img_url);
          this.userService.changeProfilePic(resp.data.profile_img_url);
        }
        if(this.currentEmail != resp.data.email){
          localStorage.setItem('email', resp.data.email);
        }
        this.toastr.success(this.translate.instant(`Changes saved successfully!!`));
        this.userService.redirectToProfile();
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error.error[0]) {
          const errorMessage = error.error_code == 'USER_ALREADY_EXISTS' ? `${this.userType} is already exist` : error.error[0];
          this.toastr.error(errorMessage);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }


  //this function is used to set profile image and generate preSignedUrl
  onProfilePhotoChange(event: any) {
    if (event.target.files.length > 0) {
      const totalBytes = event.target.files[0].size;
      const fileSize = Math.round(totalBytes / 1024);
      if (fileSize >= 5120) {
        this.toastr.error(this.translate.instant('Image size must be smaller than 5 MB'));
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.isProfileImageUploading = true;
        this.getPreSignedUrl(event.target.files[0], 'profile').then(() => {
          this.isProfileImageUploading = false;
        }).catch(() => {
          this.isProfileImageUploading = false;
          return;
        });
      };
    }
  }

  // this function is called when RUC Document modified
  public async onRUCDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          this.toastr.error(this.translate.instant('File size must be smaller than 5 MB'));
          this.isRUCDocumentUploading = false;
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
        this.isRUCDocumentUploading = true;
        await this.getPreSignedUrl(file, 'ruc', index, files.length).then((success) => {
          if (success) {
            if (index == files.length - 1) {
              this.isRUCDocumentUploading = false;
            }
          }
          index++;
        })
          .catch((error) => {
            this.isRUCDocumentUploading = false;
            return;
          });
      }
    }
  }

  // this function is called when Legal Document modified
  public async onLegalDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          this.toastr.error(this.translate.instant('File size must be smaller than 5 MB'));
          this.isLegalDocumentUploading = false;
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
        this.isLegalDocumentUploading = true;
        await this.getPreSignedUrl(file, 'legal', index, files.length).then((success) => {
          if (success) {
            if (index == files.length - 1) {
              this.isLegalDocumentUploading = false;
            }
          }
          index++;
        })
          .catch(() => {
            this.isLegalDocumentUploading = false;
            return;
          });
      }
    }
  }

  //this function is used to dele ROC Document
  deleteRUCDocument(index: number) {
    this.dealerRUCDocuments.splice(index, 1);
    if (this.dealerRUCDocuments.length === 0) {
      this.personalInfoFormControls['ruc_doc'].setValue(null);
    }
  }

  //this function is used to dele Legal Document
  deleteLegalDocument(index: number) {
    this.dealerLegalDocuments.splice(index, 1);
    if (this.dealerLegalDocuments.length === 0) {
      this.personalInfoFormControls['legal_doc'].setValue(null);
    }
  }

  //this functiojn is called when ROC Document, Legal Document or Prfile pucture change
  getPreSignedUrl(
    file: any,
    inputName: string = 'ruc',
    index = 0,
    totalFiles = 0
  ) {
    return new Promise((resolve, reject) => {
      let preSignedURL: any;
      if (inputName == 'profile') {
        preSignedURL = this.fileUploadService.getProfilePicPreSignedUrl({
          file_name: file.name,
          file_type: file.type,
          file_size: file.size
        });
      } else {
        preSignedURL = this.fileUploadService.getDealerDocPreSignedUrl({
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
                  this.personalInfoFormControls['profile_img'].setValue(res.data.key);
                  this.profileImageURL = res.data.download_url;
                  resolve(true);
                } else if (inputName == 'legal') {
                  this.dealerLegalDocuments.push({
                    key: res.data.key,
                    download_url: res.data.download_url
                  });
                  resolve(true);
                } else {
                  this.dealerRUCDocuments.push({
                    key: res.data.key,
                    download_url: res.data.download_url
                  });
                  resolve(true);
                }
              }, () => {
                this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
                reject(true);
              })
            }
          },
          (error: any) => {
            if (error.error.error[0]) {
              this.isProfileImageUploading = false
              this.toastr.error(error.error.error[0]);
            } else {
              this.isProfileImageUploading = false
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
            }
          }
        );
    });
  }

  //this function is used to get file extension using the helper function getFileType(parameter)
  getFileType(url: string) {
    return getFileType(url);
  }

  //on mobile number clear country
  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

  //this function is used to change the password
  public changePassword() {
    const modalRef = this.modalService.open(ChangePasswordComponent, {
      windowClass: 'forgot-pass-modal'
    })
    modalRef.result.then((result: boolean) => {
      if (result) {
        const modalRef = this.modalService.open(SuccessfullComponent);
        modalRef.componentInstance.passwordChanged = true;
      }
    }).catch(() => { }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  //this function is used to user profile details
  getProfileDetails() {
    this.userService.getMyProfileDetails().subscribe((resp: any) => {
      this.userDetails = resp.data;
      this.displayUserType = resp.data.role.map((x: any) => x.type);
      this.setFormValues(this.userDetails);
      setTimeout(() => {
        this.setGoogleAutoComplete();
      }, 500);
    });
  }

  //this function is used to remove the profile photo
  removeProfile() {
    this.isPhotoRemove = true;
    this.editProfileService.removeProfileImage()
      .pipe().subscribe({
        next: (res: any) => {
          this.personalInfoFormControls['profile_img'].setValue(null);
          this.isPhotoRemove = false;
          this.profileImageURL = null;
          this.userService.removeUserProfileImage();
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          this.isPhotoRemove = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      });
  }

  //this function is used to change amail address
  public changeEmail() {
    this.openChangePopup(true);
  }
  //this function is used to change mobile number
  public changeMobileNumber() {
    this.openChangePopup(false);
  }

  //this function us used to open change popup
  public openChangePopup(type: boolean) {

    const modalRef = this.modalService.open(ChangeEmailAndMobileComponent, {
      windowClass: 'forgot-pass-modal'
    })
    modalRef.componentInstance.type = type;
    modalRef.result.then((result: any) => {
      if (result.action) {
        //after getting the confirmation removing the dow from the list and after that success modal will open
        //using index and splice update original array

        this.editProfileOTP = result.editProfileOTP;
        const mobileOrEmail = type ? this.editProfileOTP.email : this.editProfileOTP.newMobile;
        if (!type) { delete result.editProfileOTP.newMobile };
        const modalRef = this.modalService.open(OtpVerificationEditProfileComponent, {
          windowClass: 'forgot-pass-modal'
        });
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.editProfileOTP = this.editProfileOTP
        modalRef.result.then((result: boolean) => {
          if (result) {
            if (type) {
              this.personalInfoForm.patchValue({ email: mobileOrEmail });
            } else {
              this.personalInfoForm.patchValue({ mobile_no: mobileOrEmail });
              this.personalInfoForm.patchValue({ mobile_no1: mobileOrEmail });
            }
            //after getting the confirmation removing the dow from the list and after that success modal will open
            //using index and splice update original array

            const modalRef = this.modalService.open(SuccessfullComponent, {
              windowClass: 'delete-vehicle-modal '
            });
            modalRef.componentInstance.editProfileType = true;
            modalRef.componentInstance.OTPtype = type;
          }
        }).catch(() => { }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
      }
    }).catch(() => { }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  setProvice(province: string) {
    this.personalInfoForm.controls['province'].setValue(province)
    this.searchProvince = '';
    this.parishList = [];
    this.personalInfoForm.controls['city'].setValue('');
    this.personalInfoForm.controls['parish'].setValue('');
    this.editProfileService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.personalInfoForm.controls['city'].setValue(city);
    this.personalInfoForm.controls['parish'].setValue('');
    this.searchCity = '';
    this.editProfileService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.personalInfoForm.controls['parish'].setValue(parish);
    this.searchParish = '';
  }

  getProvinceData(){
    this.editProfileService.getProvinceList().subscribe((resp: any) => {
      this.provinceList = resp.data;
    });
  }
}
