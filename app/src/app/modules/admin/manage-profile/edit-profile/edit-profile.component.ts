import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { TranslateService } from '@ngx-translate/core';

import { AdminProfileService } from '../admin-profile.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SpaceValidator } from 'src/app/shared/validators';
import { SetParams } from 'src/app/shared/helpers/set-params';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { Error } from 'src/app/shared/models/error.model';

import { ChangeEmailAndMobileComponent } from 'src/app/shared/modals/change-email-and-mobile/change-email-and-mobile.component';
import { ChangePasswordComponent } from 'src/app/shared/modals/change-password/change-password.component';
import { OtpVerificationEditProfileComponent } from 'src/app/shared/modals/otp-verification-edit-profile/otp-verification-edit-profile.component';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';





@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  @Input() userType: string = '';

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
  public isPhotoRemove: boolean = false;

  //this variable is used when email or number is changing
  editProfileOTP: any;
  currentProfilePicURL: string;
  currentEmail: string;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private editProfileService: AdminProfileService,
    public location: Location,
    private fileUploadService: FileUploadService,
    private userService: UserService,
    private modalService: NgbModal,
    private translate:TranslateService
  ) { }

  @ViewChild('myTypeDrop') dropdown: any;
  @ViewChild('additionalAddress') additionalAddress: any;
  @ViewChild('otherAddress') otherAddress: any;

  ngOnInit(): void {
    this.userType = this.userService.getUserType();
    this.createForm();
    this.getProfileDetails();
  }

  //set google api's after view init
  ngAfterViewInit(): void {
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
      // user_name: [],
      company_name: [],
      // vehicle_condition: [],
      // vehicle_types: [],
      email: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/), SpaceValidator.cannotContainSpace]],
      // dob: [],
      mobile_no: [{ value: null, readonly: true }, Validators.required],
      mobile_no1: [{ value: null, readonly: true }, Validators.required],
      profile_img_key: []
      // gender: ['', Validators.required],
      // additional_address: ['', Validators.required],
      // city: ['', Validators.required],
      // province: ['', Validators.required],
      //parish: ['', Validators.required],
      // ruc_doc: [],
      // legal_doc: [],
      // other_address: [],
    });
    this.personalInfoFormControls = this.personalInfoForm.controls;
  }

 //this function is used to patch form value
  setFormValues(userDetail: any) {
    this.personalInfoForm.patchValue({
      first_name: userDetail?.first_name,
      last_name: userDetail?.last_name,
      email: userDetail?.email,
      mobile_no: userDetail?.country_code + ' ' + userDetail?.mobile_no,
      company_name: userDetail?.company_name
      // additional_address: userDetail?.address?.address,
      // province: userDetail?.address?.province,
      // city: userDetail?.address?.city,
      // parish: userDetail?.address?.parish,
      // gender: userDetail?.gender,
      // dob: new Date(userDetail?.dob),
      // other_address: userDetail?.additional_address,
      // vehicle_types: userDetail?.vehicle_types,
      // user_name: userDetail?.user_name,
    })

    if (userDetail?.profile_img) {
      this.profileImageURL = userDetail.profile_img;
      this.currentProfilePicURL = userDetail.profile_img;
    }
    this.currentEmail = userDetail.email;
    this.personalInfoForm.get('mobile_no1')?.setValue(this.personalInfoForm.value.mobile_no)
    this.personalInfoForm.get('mobile_no1')?.disable();
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
            this.personalInfoFormControls['parish'].setValue(parish);
          }
          break;
        case "sublocality":
          parish = component.long_name;
          if (isAddress) {
            this.personalInfoFormControls['parish'].setValue(parish);
          }
          break;
        case "locality":
          city = component.long_name;
          if (isAddress) {
            this.personalInfoFormControls['city'].setValue(city);
          }
          break;
        case "administrative_area_level_1":
          // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
          province = component.long_name;
          if (isAddress) {
            this.personalInfoFormControls['province'].setValue(province);
          }
          break;
        case "administrative_area_level_2":
          province = component.long_name;
          if (isAddress) {
            this.personalInfoFormControls['province'].setValue(province);
          }
          break;
        case "political":
          province = component.long_name;
          if (isAddress) {
            this.personalInfoFormControls['province'].setValue(province);
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
    this.isFormSubmitted = true;
    this.personalInfoForm.markAllAsTouched();
    let userData = { ...this.personalInfoForm.value };
    if (this.personalInfoForm.invalid) {
      this.toastr.error(this.translate.instant('Please fill all required details!!'));
      return;
    }
    userData.country_code = userData.mobile_no.dialCode;
    userData.mobile_no = userData.mobile_no.number.includes(userData.country_code) ? userData.mobile_no.number.replace(userData.country_code, "") : userData.mobile_no.number;
    userData.mobile_no = userData.mobile_no.trim();
    if(!userData.profile_img_key || userData.profile_img_key.trim() == '') delete userData.profile_img_key;
    this.editProfileService.updateAdminProfile(userData).pipe().subscribe({
      next: (resp) => {
        this.isFormSubmitted = false;
        if(this.userDetails.email != resp.data.email || this.currentProfilePicURL != resp.data.profile_img
          || this.userDetails.first_name != resp.data.first_name || this.userDetails.last_name != resp.data.last_name){
          this.userService.setUserEmail(resp.data.email);
          this.userService.setUserProfileImage(resp.data.profile_img);
          this.userService.setUserFullName(resp.data.first_name + ' '+resp.data.last_name);
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
          this.toastr.error(this.translate.instant('Something Went Wrong, Please Try again later'));
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

  //this functiojn is called when ROC Document, Legal Document or Prfile pucture change
  getPreSignedUrl(
    file: any,
    inputName: string = 'ruc',
    index = 0,
    totalFiles = 0
  ) {
    return new Promise((resolve, reject) => {
      this.fileUploadService.getProfilePicPreSignedUrl({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      })
        .subscribe(
          async (res: any) => {
            if (res.data.url && res.data.key) {
              await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe((data) => {
                this.personalInfoFormControls['profile_img_key'].setValue(res.data.key);
                this.profileImageURL = res.data.download_url;
                resolve(true);
              }, () => {
                this.toastr.error(
                  this.translate.instant('Something Went Wrong, Please Try again later')
                );
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
              this.toastr.error(
                this.translate.instant('Something Went Wrong, Please Try again later')
              );
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
    modalRef.componentInstance.isAdmin = true;
    modalRef.result.then((result: boolean) => {
      if (result) {
        const modalRef = this.modalService.open(SuccessfullComponent);
        modalRef.componentInstance.passwordChanged = true;
      }
    }).catch(() => { }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  //this function is used to user profile details
  getProfileDetails() {
    this.editProfileService.getAdminProfileDeatils().subscribe((resp: any) => {
      this.userDetails = resp.data;
      this.setFormValues(this.userDetails);
    })
  }

  //this function is used to remove the profile photo
  removeProfile() {
    this.isPhotoRemove = true;
    this.editProfileService.removeProfileImage()
      .pipe().subscribe({
        next: (res: any) => {
          this.personalInfoFormControls['profile_img_key'].setValue(null);
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
            this.toastr.error(this.translate.instant('Something Went Wrong, Please Try again later'));
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
    modalRef.componentInstance.isAdmin = true;
    modalRef.result.then((result: any) => {
      if (result.action) {
        //after getting the confirmation removing the dow from the list and after that success modal will open
        //using index and splice update original array
        this.editProfileOTP = result.editProfileOTP;
        const mobileOrEmail = type ? this.editProfileOTP.email : this.editProfileOTP.newMobile;
        if (!type) {
          delete result.editProfileOTP.newMobile
        };
        const modalRef = this.modalService.open(OtpVerificationEditProfileComponent, {
          windowClass: 'forgot-pass-modal'
        });
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.editProfileOTP = this.editProfileOTP;
        modalRef.componentInstance.isAdmin = true;
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
        }).catch(() => {
        }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
      }
    }).catch(() => { }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  goback() {
    this.location.back()
  }

}

