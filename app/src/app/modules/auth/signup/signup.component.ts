import { AfterViewChecked, Component, ElementRef, NgZone, OnInit, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  CountryISO,
  PhoneNumberFormat, SearchCountryField
} from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AddVehicleService } from 'src/app/shared/services/add-vehicle.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Error } from 'src/app/shared/models/error.model';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { EmailMatchValidator } from '../../../shared/validators';
import { BuyerVehicleService } from '../../buyers/buyer-vehicle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var window: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SignupComponent implements OnInit, AfterViewChecked {
  @ViewChild('addressText') addressText: any;
  @ViewChild('additionalAddressText') additionalAddressText: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  isMobileVerification = false;
  mobileNo = '';
  personalInfo: FormGroup;
  otherDetails: FormGroup;
  personalControls: any;
  isPwdVisible = false;
  allDetails: any;
  detailControls: any;
  personal_step = false;
  other_detail_step = false;
  step = 1;
  data: any;
  today = new Date();
  userType = 'buyer';
  loading = false;
  stepTitle: Array<{ step1: string; step2: string }> = [];
  rucDocumentUrl: any;
  rucDocumentName: string | null;
  legalDocumentUrl: any;
  legalDocumentName: string | null;
  isRUCDocumentUploading: boolean = false;
  isLegalDocumentUploading: boolean = false;
  dealerRUCDocuments: Array<any> = [];
  dealerLegalDocuments: Array<any> = [];
  siteKey: any = '';
  @ViewChild('policy') openPolicy: TemplateRef<any>;
  userNameList: Array<string> = [];
  options: any = {
    componentRestrictions: { country: 'IN' },
  };
  submitted: boolean = false;
  IsaggreedRequired: boolean = false;
  @ViewChild('myTypeDrop') dropdown: any;
  policyData: any;
  policyName: any;
  searchProvince: string;
  searchCity: string;
  searchParish: string;
  provinceList: string[] = [];
  parishList: string[] = [];
  cityList: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ngZone: NgZone,
    private render: Renderer2,
    private fileUploadService: FileUploadService,
    private service: BuyerVehicleService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private addVehicleService: AddVehicleService
  ) { }

  ngOnInit(): void {
    this.today.setFullYear(new Date().getFullYear() - 18);
    this.personalInfo = this.fb.group(
      {
        type: ['buyer', [Validators.required]],
        first_name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            //SpaceValidator.cannotContainSpace,
          ],
        ],
        last_name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            //SpaceValidator.cannotContainSpace,
          ],
        ],
        user_name: ['', []],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
            ),
          ],
        ],
        confirm_email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
            ),
          ],
        ],
        gender: ['', [Validators.required]],
        dob: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
            ),
          ],
        ],
        mobile_no: ['', [Validators.required]],
      },
      {
        validator: EmailMatchValidator.mustMatch('email', 'confirm_email'),
      }
    );

    this.otherDetails = this.fb.group(
      {
        cars: ['Cars'],
        commercial_vehicle: ['Commercial vehicles'],
        new_vehicle: ['', [Validators.nullValidator]],
        used_vehicle: ['', [Validators.nullValidator]],
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        sector: [
          '',
          [
            Validators.required
          ],
        ],
        province: ['', [Validators.required]],
        is_agreed: ['', [Validators.required]],
        ruc_doc: [''],
        legal_doc: [''],
        company_name: [''],
        additional_address: [''],
        recaptcha: ['', [Validators.required]],
        dealer_name: [],
      },
      {
        validators: [this.vehicleTypes, this.vehicleConditions],
      }
    );

    this.personalControls = this.personalInfo.controls;
    this.detailControls = this.otherDetails.controls;
    this.stepTitle = [
      { step1: 'Personal Information', step2: 'Other Details' },
    ];
    this.siteKey = '6LeJk9MpAAAAALp1goNyGHQ1JlkRX3yp_hc1RI1Y'; //dev and qa
    const currentDomain = window.location.hostname;
    if (currentDomain == "riku.com.ec") {
      this.siteKey = '6LcA0tQpAAAAAJVDJ-SInmNpdJWNJgNrlvPRYlpN'; //client account
    }
  }

  ngAfterViewInit() {
    this.getProvinceList();
  }

  getProvinceList(){
    this.addVehicleService.getProvinceList()
      .subscribe((res: any) => {
        if (res.data?.length > 0) {
          this.provinceList = res.data;
        }
      }, () => {
      })
  }

  setProvince(province: string) {
    this.detailControls['province'].setValue(province);
    this.searchProvince = '';
    this.parishList = [];
    this.detailControls['city'].setValue('');
    this.detailControls['sector'].setValue('');
    this.addVehicleService.getCityList(province).subscribe((res) => {
      this.cityList = res.data.cities?.length > 0 ? res.data.cities : [];
    });
  }

  setCity(city: string) {
    this.detailControls['city'].setValue(city);
    this.detailControls['sector'].setValue('');
    this.searchCity = '';
    this.addVehicleService.getParishList(city).subscribe((res) => {
      this.parishList = res.data.parishes?.length > 0 ? res.data.parishes : [];
    });
  }

  setParish(parish: string) {
    this.detailControls['sector'].setValue(parish);
    this.searchParish = '';
  }

  getUserNameList() {
    try {
      if (this.userType != 'dealer') {
        let firstName = this.personalControls['first_name'].value;
        let lastName = this.personalControls['last_name'].value;
        if (firstName && lastName) {
          this.authService.getSuggestedUserNames({ first_name: firstName.trim(), last_name: lastName.trim() })
            .pipe()
            .subscribe((res: any) => {
              this.userNameList = res.data;
              this.dropdown.open();
              this.checkUserExist();
            }, (error) => {
              this.personalControls['user_name'].setValue(null);
            })
        }
      }
    } catch (error) {
    }
  }

  setUserName(username: any) {
    if (this.userType == 'dealer') {
      this.detailControls['dealer_name'].setValue(username.target.value);
    } else {
      this.personalControls['user_name'].setValue(username);
    }
  }

  checkUserExist() {
    try {
      let email = this.personalControls['email'].value;
      let mobile_no: any;
      let country_code: any;
      if (this.personalControls['mobile_no'].value) {
        let mobileNo = this.personalControls['mobile_no'].value;
        country_code = mobileNo.dialCode;
        let mobileNum = mobileNo.number.includes(country_code) ? mobileNo.number.replace(country_code, "") : mobileNo.number;
        mobile_no = mobileNum.replaceAll(/\s/g, '');
      }
      if (email && country_code && mobile_no) {
        this.authService.checkUserExist({ email: email, mobile_no: mobile_no, country_code: country_code })
          .pipe()
          .subscribe((res: any) => {
            if (res.data?.roles?.length > 0) {
              if (res.data.roles.includes('dealer')) {
                this.personalControls['user_name'].setValue(null);
                this.toastr.error(this.translate.instant("Your email or mobile number is already registered with us."));
              } else {
                this.personalControls['user_name'].setValue(res.data.userName);
              }
            }
          }, () => {
            this.personalControls['user_name'].setValue(null);
          })
      }
    } catch (error) {
      //console.log('error', error);
    }
  }

  formatNumber(event: any) {
    let current: string = event.target.value;
    current = current.replace(/[^\d-+ ]/g, '');
    this.personalControls['mobile_no'].setValue(current);
  }

  next() {
    if (this.step == 1) {
      this.personal_step = true;
      if (this.personalInfo.invalid) {
        return;
      }
      this.mobileNo = this.personalInfo.value.mobile_no.number;
      this.step++;
      setTimeout(() => {
        this.__getGoogleAddress();
        this.__setDealerOptionalAddress();
      }, 1000);
    } else if (this.step == 2) {
      this.other_detail_step = true;
      if (this.otherDetails.invalid) {
        return;
      }
      this.step++;
    }
  }

  previous() {
    this.step--;
    if (this.step == 1) {
      this.personal_step = false;
      this.otherDetails.controls['recaptcha'].reset();
    } else if (this.step == 2) {
      setTimeout(() => {
        this.__getGoogleAddress();
        this.__setDealerOptionalAddress();
      }, 1000);
    }
  }

  changeDateFormat(date: any) {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '/' + mm + '/' + yyyy;
  }

  ngAfterViewChecked(): void {
    const getElement: ElementRef | any = document.querySelector(`ngx-intl-tel-input .search-container input`);
    if (getElement && !getElement.getAttribute('autocomplete')) {
      this.render.setAttribute(getElement, 'autocomplete', 'none');
      this.render.setAttribute(getElement, 'type', 'search');
    }
  }

  vehicleTypes: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    if (this.userType == 'buyer' || this.userType=='user') {
      return null;
    }
    const cars = group.get('cars')?.value;
    const commercial_vehicle = group.get('commercial_vehicle')?.value;
    let obj: any = {};
    if (!cars && !commercial_vehicle) {
      const message = this.translate.instant("Vehicle type is required")
      obj['Vehicle_type_required'] = message;
    }
    return Object.keys(obj).length > 0 ? obj : null;
  };

  vehicleConditions: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    if (this.userType == 'buyer' || this.userType == 'seller' || this.userType == 'user') {
      return null;
    }
    const new_vehicle = group.get('new_vehicle')?.value;
    const used_vehicle = group.get('used_vehicle')?.value;
    let obj: any = {};
    if (!new_vehicle && !used_vehicle) {
      const message = this.translate.instant("Vehicle condition is required")
      obj['Vehicle_condition_required'] = message;
    }
    return Object.keys(obj).length > 0 ? obj : null;
  };

  changeUserRole(userType: any) {
    this.userType = userType;
    this.vehicleTypes(this.otherDetails);
    this.vehicleConditions(this.otherDetails);
    this.registerDealerFormChanges();
    this.personalControls['user_name'].setValue(null);
  }

  submit() {
    /* console.log(this.step)
    console.log(this.userType)
    console.log(this.otherDetails.invalid)
    console.log(this.otherDetails.value.is_agreed)
    console.log(this.otherDetails) */
    if (this.step == 2) {
      if (this.userType == 'dealer') {
        if (this.dealerLegalDocuments.length > 0 && this.dealerRUCDocuments.length > 0) {
          this.otherDetails.controls['ruc_doc'].setValue(this.dealerRUCDocuments.map(value => value.key));
          this.otherDetails.controls['legal_doc'].setValue(this.dealerLegalDocuments.map(value => value.key));
        }
      }
      this.loading = true;
      this.other_detail_step = true;
      this.submitted = true;
      if (this.otherDetails.invalid) {
        this.otherDetails.markAllAsTouched();
        if (!this.otherDetails.value.is_agreed) {
          this.IsaggreedRequired = true;
          return;
        } else {
          this.IsaggreedRequired = false
        }
        return;
      }
      if (!this.otherDetails.value.is_agreed) {
        this.IsaggreedRequired = true;
        return;
      } else {
        this.IsaggreedRequired = false
      }
      if (this.otherDetails.invalid) {
        this.otherDetails.markAllAsTouched();
        return;
      }

      this.data = { ...this.personalInfo.value, ...this.otherDetails.value };
      this.data.address = {
        province: this.data.province,
        city: this.data.city,
        parish: this.data.sector,
        address: this.data.address
      };
      delete this.data.cars;
      delete this.data.commercial_vehicle;
      delete this.data.new_vehicle;
      delete this.data.used_vehicle;
      delete this.data.city;
      delete this.data.province;
      delete this.data.sector;
      //delete this.data.user_name;
      delete this.data.recaptcha;
      if (this.userType != 'dealer') {
        this.data.dob = this.changeDateFormat(this.data.dob);
        delete this.data.ruc_doc;
        delete this.data.legal_doc;
        delete this.data.company_name;
        delete this.data.additional_address;
      }
      if (this.userType == 'dealer') {
        this.data.user_name = this.data.dealer_name;
        delete this.data.dealer_name;
        if (this.data.additional_address == '') {
          delete this.data.additional_address;
        }
        delete this.data.dob;
      }
      delete this.data.dealer_name;

      this.data.is_agreed == ''
        ? (this.data.is_agreed = true)
        : (this.data.is_agreed = true);

      let vehicle_types:any = [];
      if (this.otherDetails.value.cars) vehicle_types.push('cars');
      if (this.otherDetails.value.commercial_vehicle)
        vehicle_types.push('commercial_vehicles');
      this.data.vehicle_types = vehicle_types;

      let vehicle_conditions:any = [];
      if (this.otherDetails.value.new_vehicle) vehicle_conditions.push('new');
      if (this.otherDetails.value.used_vehicle) vehicle_conditions.push('used');

      this.data.vehicle_condition = vehicle_conditions;

      this.data.country_code = this.data.mobile_no.dialCode;
      this.data.mobile_no = this.data.mobile_no.number.includes(this.data.country_code) ? this.data.mobile_no.number.replace(this.data.country_code, "") : this.data.mobile_no.number;
      this.data.mobile_no = this.data.mobile_no.replaceAll(/\s/g, '');
      this.data.password = this.data.password.trim();
      //console.log(this.data)
      this.authService
        .register(this.data)
        .pipe()
        .subscribe(
          (response: any) => {
            let code = response.success_code
            let emailVerified = response.data.is_email_verified;
            let mobileNoVerified = response.data.is_mobile_verified;
            this.loading = false;
            localStorage.setItem('mobile_no', this.data.mobile_no);
            localStorage.setItem('country_code', this.data.country_code);
            localStorage.setItem('email', this.data.email)
            this.toastr.success(this.translate.instant('Registration success!'));

            if (code === 'ROLE_ADDED') {
              if (mobileNoVerified == true) {
                this.router.navigate(['auth/login'])
              } else if (mobileNoVerified == false) {
                this.router.navigate(['auth/mobile-verification']);
              }
            }
            else if (code === 'USER_REGISTERED') {
              if (mobileNoVerified === true) {
                this.router.navigate(['auth/login'])
              } else if (mobileNoVerified !== true) {
                this.router.navigate(['auth/mobile-verification']);
              }
            }
          },
          ({ error, status }) => {
            this.loading = false;
            if (error.error[0]) {
              this.toastr.error(error.error[0]);
            } else {
              this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
            }
            if (error.error_code == 'USER_ALREADY_EXISTS') {
              this.router.navigate(['/auth/login']);
            }
            if (error.error_code == 'CAN_NOT_SEND_SMS') {
              localStorage.setItem('mobile_no', this.data.mobile_no);
              localStorage.setItem('country_code', this.data.country_code);
              localStorage.setItem('email', this.data.email);
              this.toastr.success(this.translate.instant('Registration success!'));
              this.router.navigate(['auth/mobile-verification']);
            }
          }
        );
    }
  }

  registerDealerFormChanges() {
    if (this.userType == 'dealer') {
      this.stepTitle = [
        {
          step1: 'Account Representative Information',
          step2: 'Dealership Information',
        },
      ];
      this.personalInfo.controls['dob'].clearValidators();
      this.personalInfo.controls['dob'].updateValueAndValidity();

      // this.otherDetails.controls['gender'].clearValidators();
      // this.otherDetails.controls['gender'].updateValueAndValidity();

      this.otherDetails.controls['company_name'].setValidators([
        Validators.required,
      ]);
      this.otherDetails.controls['company_name'].updateValueAndValidity();

      this.otherDetails.controls['ruc_doc'].setValidators([
        Validators.required,
      ]);
      this.otherDetails.controls['ruc_doc'].updateValueAndValidity();

      this.otherDetails.controls['legal_doc'].setValidators([
        Validators.required,
      ]);
      this.otherDetails.controls['legal_doc'].updateValueAndValidity();
    } else {
      this.stepTitle = [
        { step1: 'Personal Information', step2: 'Other Details' },
      ];
      this.personalInfo.controls['dob'].setValidators([Validators.required]);
      this.personalInfo.controls['dob'].updateValueAndValidity();

      // this.otherDetails.controls['gender'].setValidators([Validators.required]);
      // this.otherDetails.controls['gender'].updateValueAndValidity();

      this.otherDetails.controls['company_name'].clearValidators();
      this.otherDetails.controls['company_name'].updateValueAndValidity();

      this.otherDetails.controls['ruc_doc'].clearValidators();
      this.otherDetails.controls['ruc_doc'].updateValueAndValidity();

      this.otherDetails.controls['legal_doc'].clearValidators();
      this.otherDetails.controls['legal_doc'].updateValueAndValidity();
    }
  }

  public async onRUCDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 10240) {
          this.toastr.error(this.translate.instant('File size must be smaller than 10 MB'));
          this.isRUCDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'application/pdf'
        ) {
          this.toastr.error(this.translate.instant('Allowed file type is only PDF'));
          return;
        }
        this.isRUCDocumentUploading = true;
        await this.getPreSignedUrl(file, 'ruc', index, files.length)
          .then((success) => {
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
              }
            }
            index++;
          })
          .catch((error) => {
            this.isLegalDocumentUploading = false;
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
                  if (inputName == 'legal') {
                    this.dealerLegalDocuments.push({
                      key: res.data.key,
                      src: res.data.download_url
                    });
                    resolve(true);
                  } else {
                    this.dealerRUCDocuments.push({
                      key: res.data.key,
                      src: res.data.download_url
                    });
                    resolve(true);
                  }
                }, (error) => {
                  this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
                  reject(true);
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
    } catch (ex) { }

  }

  private __getGoogleAddress() {
    let autocomplete: google.maps.places.Autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.addressText?.nativeElement, {
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
    if (this.userType == 'dealer') {
      let autocomplete: google.maps.places.Autocomplete;
      autocomplete = new google.maps.places.Autocomplete(this.additionalAddressText?.nativeElement, {
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
            // if (isAddress) {
            //   this.otherDetails.controls['sector'].setValue(parish);
            // }
            break;
          case "sublocality":
            parish = component.long_name;
            // if (isAddress) {
            //   this.otherDetails.controls['sector'].setValue(parish);
            // }
            break;
          case "locality":
            city = component.long_name;
            // if (isAddress) {
            //   this.otherDetails.controls['city'].setValue(city);
            // }
            break;
          case "administrative_area_level_1":
            // address1 += address1 != '' ? `, ${component.long_name}` : `${component.long_name}`;
            province = component.long_name;
            // if (isAddress) {
            //   this.otherDetails.controls['province'].setValue(province);
            // }
            break;
          case "administrative_area_level_2":
            province = component.long_name;
            // if (isAddress) {
            //   this.otherDetails.controls['province'].setValue(province);
            // }
            break;
          case "political":
            province = component.long_name;
            // if (isAddress) {
            //   this.otherDetails.controls['province'].setValue(province);
            // }
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
      isAddress ? this.otherDetails.controls['address'].setValue(address1) : this.otherDetails.controls['additional_address'].setValue(address1);
    } catch (ex) {
    }
  }

  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

  popup(typeOfPolicy: any) {
    this.service.getTermsandConditions(typeOfPolicy).subscribe((resp: any) => {
      this.policyData = resp.data.html
      this.policyName = resp.data.type
      const modalRef = this.modalService.open(this.openPolicy, { size: 'lg', backdrop: 'static', centered: true })
    })
  }

}
