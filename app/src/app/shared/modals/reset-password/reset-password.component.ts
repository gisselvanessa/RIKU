import { Component, Input, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { samePasswords, SpaceValidator} from "../../../shared/validators";
import { NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { SuccessfullComponent } from "../successfull/successfull.component";
import { LoginService } from '../../../modules/auth/login/login.service';
import { AdminService } from 'src/app/modules/admin/admin-login/admin.service';
import { Error } from '../../models/error.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  submitting: boolean;
  errStatus: any;
  password_type="password";
  confirmpass_type= "password";
  formControls:any;
  token:any;
  resetUserData:any;
  @Input() isForAdmin: boolean = false;

  constructor( public router: Router,
               public fb: FormBuilder,
               public loginService: LoginService,
               private toastr: ToastrService,
               public activeModal: NgbActiveModal,
               private modalService: NgbModal,
               private adminService: AdminService,
               private translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.createResetForm();
    this.formControls = this.form.controls;
    if(localStorage.getItem("reset")){
      const reset_key = JSON.parse(localStorage.getItem('reset') || '{}')
      if (this.isForAdmin) {
        this.token = reset_key.token;
      } else {
        this.token = reset_key.params.token;
      }
    }
    if(!this.isForAdmin){
      if(localStorage.getItem('resetUserData')){
        this.resetUserData = JSON.parse(localStorage.getItem('resetUserData') || "")
      }
    }
  }

  createResetForm(){
    this.form = this.fb.group({
      password: [null, { validators: [Validators.required, SpaceValidator.cannotContainSpace ,Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)] }],
      confirm_password: [null, { validators: [Validators.required, SpaceValidator.cannotContainSpace] }],
      // remember_me: [false],
    },<AbstractControlOptions>{
      validators: samePasswords('password', 'confirm_password')
    });
  }

  showPassword(pass:string ) {
    if(pass == 'password-field'){
      if (this.password_type === 'password') {
        this.password_type = 'text';
      } else {
        this.password_type = 'password';
      }
    }else {
      if (this.confirmpass_type === 'password') {
        this.confirmpass_type = 'text';
      } else {
        this.confirmpass_type = 'password';
      }
    }
  }


  onSubmit() {
    this.submitting = true;
    if (!this.form.valid) {
      return;
    }
    if (this.isForAdmin) {
      let reset_data = {}
      if (this.token) {
        reset_data = {
          token: this.token,
          new_password: this.form.value.password
        }
      }
      this.adminService.resetPassword(reset_data).subscribe({
        next: () => {
          this.activeModal.dismiss('close');
          if (localStorage.getItem('reset')) {
            localStorage.removeItem('reset')
          }
          this.submitting = false;
          this.form.reset();
          this.activeModal.dismiss('Cross click')
          const modelRef = this.modalService.open(SuccessfullComponent);
          modelRef.componentInstance.loginSuccess = true;
        },
        error: (errorRes:Error) => {

          const error = errorRes.error;
          this.submitting = false;
          // this.errStatus = status;
          if (error.error) {
            error.error.forEach((message: any) => {
              this.toastr.error(message);
            }
            )
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
        }
      });
    } else {
      let reset_data = {}

      if (this.token) {
        reset_data = {
          login_type: "email",
          token: this.token,
          new_password: this.form.value.password
        }
      } else {
        reset_data = {
          login_type: "mobile",
          country_code: this.resetUserData.country_code,
          mobile_no: this.resetUserData.mobile_no,
          otp: this.resetUserData.code,
          new_password: this.form.value.password
        }
      }
      this.loginService.resetPassword(reset_data).subscribe(
        (response) => {
          this.activeModal.dismiss('close');
          if (localStorage.getItem('reset')) {
            localStorage.removeItem('reset')
          }
          if (localStorage.getItem('resetUserData')) {
            localStorage.removeItem('resetUserData')
          }
          this.submitting = false;
          this.form.reset();
          this.activeModal.dismiss('Cross click')
          const modelRef = this.modalService.open(SuccessfullComponent);
          modelRef.componentInstance.loginSuccess = true;
        },
        ({ error, status }) => {
          this.submitting = false;
          this.errStatus = status;
          if (error.error) {
            error.error.forEach((message: any) => {
              this.toastr.error(message);
            }
            )
          } else {
            this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
          }
          // this.activeModal.dismiss('close');
        }
      );
    }
  }
}
