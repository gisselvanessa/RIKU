import { Component, OnInit, ViewEncapsulation, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpaceValidator } from 'src/app/shared/validators';
import { AdminUsersService } from '../admin-users.service';
import {
  CountryISO,
  PhoneNumberFormat, SearchCountryField
} from 'ngx-intl-tel-input';
import { User } from '../user.model';
import { DeleteUsertypeComponent } from 'src/app/shared/modals/admin/delete-usertype/delete-usertype.component';
import { Location } from '@angular/common';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { ActivateDeactivateComponent } from '../activate-deactivate/activate-deactivate.component';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EditUsersComponent implements OnInit, AfterViewInit {
  userType: string = 'buyer';
  userTypeObject: any;
  personalInfoForm: FormGroup;
  otherDetails: FormGroup;
  personalInfoFormControls: any;
  isFormSubmitted: boolean = false;
  today = new Date();
  currentStep: number = 1;
  selectedVehicleTypes: Array<string> = [];
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
  selectedVehicleConditions: Array<string> = [];
  availableUserNameList: Array<string> = [];
  isUserNameDisabled: boolean = true;
  userDetail: User;
  deletedUserId: string;
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

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
    private activatedRoute: ActivatedRoute,
    public location: Location,
    private modalService: NgbModal, private translate: TranslateService, private userService: UserService, private userPermissionService: UserPermissionService) {
  }

  @ViewChild('additionalAddress') additionalAddress: any;
  @ViewChild('otherAddress') otherAddress: any;

  ngOnInit(): void {
    this.getProvinceData();
    this.today.setFullYear(new Date().getFullYear() - 18);
    this.createForm();
    this.getUserDetails();
    this.adminUsersService.getDeleteRole.subscribe((deletedObj) => {
      if (deletedObj.user_id == this.deletedUserId) {
        if (this.userDetail?.user_type.length > 1) {
          deletedObj.type.forEach((type: any) => {
            const deleteUserTypeIndex = this.userDetail.user_type.findIndex((x: any) => x.type == type);
            if (deleteUserTypeIndex > -1) {
              this.userDetail.user_type.splice(deleteUserTypeIndex, 1);
              this.userType = this.userDetail.user_type.map((x: any) => x.type).toString().trim();
            }
          })
        }
      }
    })
    this.userRolePermission()
  }
  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'user_management')
    //     this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions
    //   })
    // } else {
    //   this.modulePermissions.can_create = true;
    //   this.modulePermissions.can_delete = true;
    //   this.modulePermissions.can_edit = true;
    //   this.modulePermissions.can_export = true;
    //   this.modulePermissions.can_list = true;
    //   this.modulePermissions.can_view_details = true;
    // }
    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.UserManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }
  getUserDetails() {
    try {
      this.userId = this.activatedRoute.snapshot.paramMap.get('id') || '';
      this.adminUsersService.getUser(this.userId).pipe().subscribe((response: any) => {
        this.userDetail = response.data;
        this.userTypeObject = this.userDetail.user_type
        this.setFormValues(this.userDetail);
      }, (error) => {
        const message = this.translate.instant('Something Went Wrong Please Try again later')
        this.toastr.error(message);
        this.router.navigate(['/admin/users']);
      })

    } catch (error) {
      //this.router.navigate(['/admin/users']);
    }
  }

  ngAfterViewInit(): void {
    this.__getGoogleAddress();
  }

  createForm() {
    try {
      this.personalInfoForm = this.fb.group(
        {
          type: ['buyer', [Validators.required]],
          first_name: ['', [Validators.required, Validators.minLength(3)]],
          last_name: ['', [Validators.required, Validators.minLength(3)]],
          user_name: ['', []],
          company_name: [''],
          vehicle_condition: ['new'],
          vehicle_types: [''],
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
          this.personalInfoForm.controls['company_name'].removeValidators([Validators.required]);
          this.personalInfoForm.controls['vehicle_condition'].removeValidators([Validators.required]);
          this.personalInfoForm.controls['vehicle_types'].removeValidators([Validators.required]);
          this.personalInfoForm.controls['ruc_doc'].removeValidators([Validators.required]);
          this.personalInfoForm.controls['legal_doc'].removeValidators([Validators.required]);
          this.personalInfoForm.controls['gender'].removeValidators([Validators.required]);
          this.personalInfoForm.controls['dob'].removeValidators([Validators.required]);
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

  setFormValues(userDetail: User) {
    this.personalInfoFormControls['first_name'].patchValue(userDetail.first_name);
    this.personalInfoFormControls['last_name'].patchValue(userDetail.last_name);
    this.personalInfoFormControls['email'].patchValue(userDetail.email);
    this.personalInfoFormControls['mobile_no'].patchValue(userDetail.country_code + ' ' + userDetail.mobile_no);
    this.personalInfoFormControls['additional_address'].patchValue(userDetail.address?.address);
    this.personalInfoFormControls['province'].patchValue(userDetail.address?.province);
    this.personalInfoFormControls['city'].patchValue(userDetail.address?.city);
    this.personalInfoFormControls['parish'].patchValue(userDetail.address?.parish);
    this.personalInfoFormControls['gender'].patchValue(userDetail.gender);
    this.personalInfoFormControls['company_name'].patchValue(userDetail.company_name);
    this.personalInfoFormControls['dob'].patchValue(new Date(userDetail.dob));
    this.personalInfoFormControls['other_address'].patchValue(userDetail.additional_address);
    this.userType = userDetail.user_type.map((x: any) => x.type).toString().trim();
    this.personalInfoFormControls['type'].patchValue(this.userType);
    this.personalInfoFormControls['user_name'].patchValue(userDetail.user_name);
    this.selectedVehicleConditions = userDetail.vehicle_condition ? userDetail?.vehicle_condition : [];
    this.selectedVehicleTypes = userDetail?.vehicle_types ? userDetail?.vehicle_types : [];
    this.dealerLegalDocuments = userDetail?.legal_doc ? userDetail?.legal_doc : [];
    this.dealerRUCDocuments = userDetail?.ruc_doc ? userDetail?.ruc_doc : [];
    if (userDetail.profile_pic) {
      this.profileImageURL = userDetail.profile_pic.download_url;
      this.personalInfoFormControls['profile_img'].patchValue(userDetail.profile_pic.key);
    }

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

  formatUserType(userType: string) {
    return userType.toString().replace(/(^|\/|-|,)(\S)/g, s => s.toUpperCase());
  }

  getUserNameList() {
    // try {
    //   let firstName = this.personalInfoFormControls['first_name'].value;
    //   let lastName = this.personalInfoFormControls['last_name'].value;
    //   if (firstName && lastName) {
    //     this.adminUsersService.getSuggestedUserNames({first_name: firstName.trim(), last_name: lastName.trim()})
    //       .pipe()
    //       .subscribe((res: any) => {
    //         this.personalInfoFormControls['user_name'].setValue(res.data[0]);
    //       }, (error) => {
    //         this.personalInfoFormControls['user_name'].setValue(null);
    //       })
    //   }
    // } catch (error) {
    // }
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

  setUserType(event: any) {
    this.userType = event.target.value;
    this.isFormSubmitted = false;
    if (this.userType === 'dealer') {
      this.personalInfoForm.reset();
      this.personalInfoFormControls['type'].setValue(event.target.value);
    } else {
      this.currentStep = 1;
      this.personalInfoFormControls['type'].setValue(event.target.value);
    }
  }

  setGender(event: any) {
    this.personalInfoFormControls['gender'].setValue(event.target.value);
  }

  setVehicleCondition(vehicleCondition: string) {
    if (this.selectedVehicleConditions.includes(vehicleCondition)) {
      this.selectedVehicleConditions.splice(this.selectedVehicleConditions.indexOf(vehicleCondition), 1)
    } else {
      this.selectedVehicleConditions.push(vehicleCondition);
    }
    this.personalInfoFormControls['vehicle_condition'].setValue(this.selectedVehicleConditions);
  }

  setVehicleTypes(vehicleType: string) {
    if (this.selectedVehicleTypes.includes(vehicleType)) {
      this.selectedVehicleTypes.splice(this.selectedVehicleTypes.indexOf(vehicleType), 1)
    } else {
      this.selectedVehicleTypes.push(vehicleType);
    }
    this.personalInfoFormControls['vehicle_types'].setValue(this.selectedVehicleTypes);
  }

  changeStatus(event: any, indexOfToggle: any) {
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.userId = this.userId;
    const message = this.translate.instant("Back to Edit Details")
    modalRef.componentInstance.changeSuccessBtnText = message;
    modalRef.componentInstance.userType = this.userTypeObject[indexOfToggle].type
    modalRef.componentInstance.userStatus = this.userTypeObject[indexOfToggle].status
    modalRef.componentInstance.active = event.target.checked;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'cancel' || resp == 0) {
        event.target.checked = !event.target.checked;
        this.userTypeObject[indexOfToggle].status = event.target.checked ? 'Active' : 'Inactive';
      }
      if (resp === 'confirm') {
        this.getUserDetails()
      }
    })
  }

  addUpdateUser() {
    try {
      this.isSubmitted = true;
      this.isFormSubmitted = true;
      const userData = { ...this.personalInfoForm.value };
      if (this.personalInfoForm.invalid) {
        const message = this.translate.instant('Please fill all required details!!')
        this.toastr.error(message);
        return;
      }
      userData.country_code = userData.mobile_no.dialCode;
      userData.mobile_no = userData.mobile_no.number.includes(userData.country_code) ? userData.mobile_no.number.replace(userData.country_code, "") : userData.mobile_no.number;
      // userData.mobile_no = userData.mobile_no.replaceAll(/\s/g,'');
      userData.address = {
        province: userData.province,
        city: userData.city,
        parish: userData.parish,
        address: userData.additional_address
      };
      delete userData.profile_img;
      delete userData.gender;
      delete userData.dob;
      delete userData.type;
      delete userData.user_name;
      delete userData.province;
      delete userData.city;
      delete userData.parish;
      delete userData.vehicle_condition;
      delete userData.vehicle_types;
      delete userData.company_name;
      delete userData.ruc_doc;
      delete userData.legal_doc;
      delete userData.first_name;
      delete userData.last_name;
      delete userData.first_name;
      delete userData.other_address;
      delete userData.additional_address;
      userData.user_id = this.userId;
      this.adminUsersService.updateUser(userData)
        .pipe()
        .subscribe((response: any) => {
          this.isFormSubmitted = false;
          this.personalInfoForm.reset();
          this.toastr.success(this.translate.instant('Changes saved successfully!!'));
          this.router.navigate(['/admin/users']);
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
      console.log('error', error);
    }
  }

  // onProfilePhotoChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     const totalBytes = event.target.files[0].size;
  //     const fileSize = Math.round(totalBytes / 1024);
  //     if (fileSize >= 5120) {
  //       this.toastr.error('Image size must be smaller than 5 MB');
  //       return;
  //     }
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]);
  //     reader.onload = (_event) => {
  //       this.isProfileImageUploading = false;
  //       this.getPreSignedUrl(event.target.files[0], 'profile').then((res) => {
  //         this.isProfileImageUploading = false;
  //       }).catch((error) => {
  //         this.isProfileImageUploading = false;
  //         return;
  //       });
  //     };
  //   }
  // }

  // deleteProfilePhoto() {
  //   this.profileImageURL = null;
  //   this.personalInfoFormControls['profile_img'].setValue(null);
  // }

  // public async onRUCDocumentChange(event: any) {
  //   let files = event.target.files;
  //   if (files) {
  //     let index = 0;
  //     for (let file of files) {
  //       const totalBytes = file.size;
  //       const fileSize = Math.round(totalBytes / 1024);
  //       if (fileSize >= 5120) {
  //         this.toastr.error('File size must be smaller than 5 MB');
  //         this.isRUCDocumentUploading = false;
  //         return;
  //       }
  //       const fileType = file.type;
  //       if (
  //         fileType != 'image/png' &&
  //         fileType != 'image/jpeg' &&
  //         fileType != 'application/pdf'
  //       ) {
  //         this.toastr.error('Allowed file type is only PDF, PNG');
  //         return;
  //       }
  //       this.isRUCDocumentUploading = true;
  //       await this.getPreSignedUrl(file, 'ruc', index, files.length)
  //         .then((success) => {
  //           if (success) {
  //             if (index == files.length - 1) {
  //               this.isRUCDocumentUploading = false;
  //             }
  //           }
  //           index++;
  //         })
  //         .catch((error) => {
  //           this.isRUCDocumentUploading = false;
  //           return;
  //         });
  //     }
  //   }
  // }

  // public async onLegalDocumentChange(event: any) {
  //   let files = event.target.files;
  //   if (files) {
  //     let index = 0;
  //     for (let file of files) {
  //       const totalBytes = file.size;
  //       const fileSize = Math.round(totalBytes / 1024);
  //       if (fileSize >= 10240) {
  //         this.toastr.error('File size must be smaller than 5 MB');
  //         this.isLegalDocumentUploading = false;
  //         return;
  //       }
  //       const fileType = file.type;
  //       if (
  //         fileType != 'image/png' &&
  //         fileType != 'image/jpeg' &&
  //         fileType != 'application/pdf'
  //       ) {
  //         this.toastr.error('Allowed file type is only PDF, PNG');
  //         return;
  //       }
  //       this.isLegalDocumentUploading = true;
  //       await this.getPreSignedUrl(file, 'legal', index, files.length)
  //         .then((success) => {
  //           if (success) {
  //             if (index == files.length - 1) {
  //               this.isLegalDocumentUploading = false;
  //             }
  //           }
  //           index++;
  //         })
  //         .catch((error) => {
  //           this.isLegalDocumentUploading = false;
  //           return;
  //         });
  //     }
  //   }
  // }

  // deleteRUCDocument(index: number) {
  //   this.dealerRUCDocuments.splice(index, 1);
  // }

  // deleteLegalDocument(index: number) {
  //   this.dealerLegalDocuments.splice(index, 1);
  // }

  // async getPreSignedUrl(
  //   file: any,
  //   inputName: string = 'ruc',
  //   index = 0,
  //   totalFiles = 0
  // ) {
  //   try {
  //     return new Promise((resolve, reject) => {
  //       let preSignedURL: any;
  //       if (inputName == 'profile') {
  //         preSignedURL = this.fileUploadService
  //           .getProfilePicPreSignedUrl({
  //             file_name: file.name,
  //             file_type: file.type,
  //             file_size: file.size
  //           });
  //       } else {
  //         preSignedURL = this.fileUploadService
  //           .getDealerDocPreSignedUrl({
  //             file_name: file.name,
  //             file_type: file.type,
  //             file_size: file.size,
  //             doc_type: inputName
  //           });
  //       }
  //       preSignedURL
  //         .subscribe(
  //           async (res: any) => {
  //             if (res.data.url && res.data.key) {
  //               await this.fileUploadService.uploadFile(res.data.url, file).pipe().subscribe((data) => {
  //                 if (inputName == 'profile') {
  //                   this.personalInfoFormControls['profile_img'].setValue(res.data.key);
  //                   this.profileImageURL = res.data.download_url;
  //                 } else if (inputName == 'legal') {
  //                   this.dealerLegalDocuments.push({
  //                     key: res.data.key,
  //                     src: res.data.download_url
  //                   });
  //                   resolve(true);
  //                 } else {
  //                   this.dealerRUCDocuments.push({
  //                     key: res.data.key,
  //                     src: res.data.download_url
  //                   });
  //                   resolve(true);
  //                 }
  //               }, (error) => {
  //                 this.toastr.error(
  //                   'Something Went Wrong Please Try again later'
  //                 );
  //                 reject(true);
  //               })
  //             }
  //           },
  //           (error: any) => {
  //             if (error.error[0]) {
  //               this.toastr.error(error.error[0]);
  //             } else {
  //               this.toastr.error(
  //                 'Something Went Wrong Please Try again later'
  //               );
  //             }
  //           }
  //         );
  //     });
  //   } catch (ex) { }

  // }
  deleteUser() {
    if (this.userDetail.user_type.length > 1) {
      const modalRef = this.modalService.open(DeleteUsertypeComponent, {
        windowClass: 'delete-vehicle-modal'
      })
      this.deletedUserId = this.userId;
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.isFromAdmin = true;
      const message = this.translate.instant("Back to User Listing")
      modalRef.componentInstance.deleteSuccessBtnText = message;
      modalRef.componentInstance.userType = this.userDetail.user_type.map((x: any) => x.type);
    } else {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, {
        windowClass: 'delete-vehicle-modal'
      })
      this.deletedUserId = this.userId;
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.isFromAdmin = true;
      const message = this.translate.instant("Back to User Listing")
      modalRef.componentInstance.deleteSuccessBtnText = message;
      modalRef.componentInstance.user_type = this.userDetail.user_type.map((x: any) => x.type);
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
