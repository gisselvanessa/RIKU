import { Component, Input, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router} from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { samePasswords, SpaceValidator} from "../../../shared/validators";
import { NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { LoginService } from '../../../modules/auth/login/login.service';
import { ChangePasswordService } from '../../services/change-password.service';
import { Error } from '../../models/error.model';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  //define the form variables
  form: FormGroup;
  submitting: boolean;
  formControls:any;
  @Input() isAdmin: boolean = false;

  //to view the password
  current_password = "password";
  password_type = "password";
  confirmpass_type = "password";


  constructor( public router: Router,
    public fb: FormBuilder,
    public loginService: LoginService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private userService:UserService,
    private changePasswordService: ChangePasswordService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    //create change password form
    this.createResetForm();

    //set form controls to variables
    this.formControls = this.form.controls;
  }

  // this function is used to set the reste password form
  createResetForm(){
    this.form = this.fb.group({
      user_id: this.userService.getUserId(),
      current_password: ['', { validators: [Validators.required] }],
      new_password: ['', { validators: [Validators.required, SpaceValidator.cannotContainSpace, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)] }],
      confirm_password: ['', { validators: [Validators.required, SpaceValidator.cannotContainSpace] }],
    },<AbstractControlOptions>{
      validators: samePasswords('new_password', 'confirm_password')
    });
  }

  // This function is used to set new password
  onSubmit() {
    this.submitting = true;
    if (!this.form.valid) {
      return;
    }
    let reset_data = { ...this.form.value }
    delete reset_data.confirm_password;
    this.submitting = true;
    const changePasswordAPI = this.isAdmin ? this.changePasswordService.changeAdminPassword(reset_data) : this.changePasswordService.changePassword(reset_data)
    changePasswordAPI.subscribe({
      next: () => {
        this.activeModal.close(true);
        this.form.reset();
        this.submitting = false;
      },
      error: (errorRes:Error) => {
        const error = errorRes.error;
        this.submitting = false;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });
  }

}

