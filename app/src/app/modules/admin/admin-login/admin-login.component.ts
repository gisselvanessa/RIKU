import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { emailValidator, SpaceValidator } from "../../../shared/validators";
import { TokenService } from "../../../shared/services/token.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../../shared/services/auth.service";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { UserService } from '../../../shared/services/user.service';
import { ResetPasswordComponent } from 'src/app/shared/modals/reset-password/reset-password.component';
import { ForgotPasswordComponent } from 'src/app/shared/modals/forgot-password/forgot-password.component';
import { ValidateUserComponent } from 'src/app/shared/modals/validate-user/validate-user.component';
import { AdminService } from './admin.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdminLoginComponent implements OnInit {
  form: FormGroup;
  submitting: boolean;
  errStatus: any;
  errMessage: any;
  err: any;
  type: string = 'password';
  formControls: any;
  loginparamsObject: any;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  resend = false;
  verificationType: any;
  loading: boolean = false;
  isRememberMe: boolean = false;

  constructor(
    public router: Router,
    private routerAct: ActivatedRoute,
    public fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService,
    private adminService: AdminService,
    private userPermissionService: UserPermissionService,
    private modalService: NgbModal, public activeModal: NgbActiveModal,
    private translateService:TranslateService
  ) {

  }

  ngOnInit(): void {
    this.createLoginForm();
    this.formControls = this.form.controls;
    const queryParams: any = this.routerAct.snapshot.queryParams;
    if (queryParams && queryParams.token && queryParams.type == 'RESET_PASSWORD') {
      this.loginparamsObject = { ...queryParams };
      localStorage.setItem("reset", JSON.stringify(this.loginparamsObject))
      this.router.navigate(['/admin/login'])
      const modelRef = this.modalService.open(ResetPasswordComponent, {
        windowClass: 'forgot-pass-modal'
      })
      modelRef.componentInstance.isForAdmin = true;
    }
  }

  createLoginForm() {
    this.form = this.fb.group({
      email: [null, { validators: [Validators.required, emailValidator] }],
      password: [null, { validators: [Validators.required] }],
    });

    const isRemember = this.adminService.getRememberAdmin();
    if (isRemember) {
      this.form.controls['email'].setValue(isRemember.email);
      this.isRememberMe = true;
    }
  }

  openForgot() {
    if (localStorage.getItem('reset')) {
      localStorage.removeItem('reset')
    }
    const modalRef = this.modalService.open(ForgotPasswordComponent, {
      windowClass: 'forgot-pass-modal'
    })
    modalRef.componentInstance.isForAdmin = true;
  }

  validateUser() {
    const modalRef = this.modalService.open(ValidateUserComponent, {
      windowClass: 'validate-pass-modal'
    })
    modalRef.componentInstance.verificationType = this.verificationType;
  }

  onSubmit() {
    this.submitting = true;
    if (!this.form.valid) {
      // this.toastr.error('Email and Password is required.');
      return;
    }
    let formData;
    if (this.form.value.email && this.form.value.password) {
      formData = { email: this.form.value.email, password: this.form.value.password };
    }
    this.loading = true;
    this.adminService.logIn(formData).subscribe(
      (response) => {
        this.authService.setAccessTokenStorage(response.data.token);
        if (response.data.sub_role_id && response.data.sub_role_id.length > 0) {
          this.userPermissionService.setUserRoleId(response.data.sub_role_id.toString());
        }
        if (this.isRememberMe) {
          this.adminService.rememberAdmin({ email: this.form.value.email, remember_me: true })
        } else {
          this.adminService.removeRememberAdmin();
        }
        const userId = response.data.id;
        const userEmail = response.data.email;
        const userProfileImage = response.data.profile_img_url;
        this.submitting = false;
        this.userService.setUserType(response.data.roles.includes('super_admin') ? 'super_admin': response.data.roles.toString());
        this.userService.setUserId(userId)
        this.userService.setUserEmail(userEmail)
        if(userProfileImage) this.userService.setUserProfileImage(userProfileImage);
        if(response.data.first_name) this.userService.setUserFullName(response.data.first_name + ' '+ response.data.last_name);
        this.authService.changeLoggedIn(true);
        this.userService.navigateAsPerUserType();
        this.toastr.success(this.translateService.instant('Successfully Login'));
      },
      ({ error, status }) => {
        this.submitting = false;
        this.loading = false;
        this.err = error;
        this.errStatus = status;
        this.errMessage = error?.message;
        if (error?.error) {
          if (error.error_code == 'EMAIL_NOT_VERIFIED' || error.error_code == 'MOBILE_NOT_VERIFIED') {
            this.verificationType = error.error_code;
            this.resend = true;
          }
          error.error.forEach((message: any) => {
            this.toastr.error(message);
          }
          )
        } else {
          this.toastr.error(this.translateService.instant('Something Went Wrong Please Try again later'));
        }
      }
    );
  }
}
