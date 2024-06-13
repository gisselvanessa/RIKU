import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { FaqService } from '../faq.service';
import { Error } from 'src/app/shared/models/error.model';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent implements OnInit {

  faqForm: FormGroup;
  faqFormControls: any;
  isFormSubmitted: boolean = false;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private location: Location,
    private modalService: NgbModal,
    private faqService: FaqService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.faqForm = this.fb.group(
      {
        question: ['', [Validators.required]],
        answer: ['', [Validators.required]],
      }
    );

    //set the from controls to forms
    this.faqFormControls = this.faqForm.controls;
  }

  submitFaq() {
    if (this.faqForm.valid) {
      this.faqService.addFAQ(this.faqForm.value).pipe().subscribe({
        next: (response: any) => {
          this.isFormSubmitted = false;
          this.faqForm.reset();
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'add-blog-modal ',
          });
          modalRef.componentInstance.faqAdded = true;
          modalRef.componentInstance.faqType = 'add';
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);
          }
        }
      });
    } else {
      this.isFormSubmitted = true;
      this.faqForm.markAllAsTouched();
    }
  }

  back() {
    this.location.back();
  }
}
