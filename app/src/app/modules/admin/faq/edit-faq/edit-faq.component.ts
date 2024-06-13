import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { FaqService } from '../faq.service';
import { Error } from 'src/app/shared/models/error.model';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-faq',
  templateUrl: './edit-faq.component.html',
  styleUrls: ['./edit-faq.component.scss']
})
export class EditFaqComponent implements OnInit {

  faqForm: FormGroup;
  faqFormControls: any;
  isFormSubmitted: boolean = false;
  faqId: string;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private faqService: FaqService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((params: Params) => {
      this.faqId = params['id'];
    });
    this.createForm();
    this.getBlogDetails(this.faqId);
  }

  createForm() {
    this.faqForm = this.fb.group({
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      uuid: [],
    });

    //set the from controls to forms
    this.faqFormControls = this.faqForm.controls;
  }

  submitFaq() {
    if (this.faqForm.valid) {
      this.faqService.updateFAQ(this.faqForm.value).pipe().subscribe({
        next: (response: any) => {
          this.isFormSubmitted = false;
          this.faqForm.reset();
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'add-blog-modal ',
          });
          modalRef.componentInstance.faqAdded = true;
          modalRef.componentInstance.faqType = 'edit';
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

  getBlogDetails(blogId: any) {
    this.faqService.getFAQ(this.faqId).subscribe((data) => {
      this.setFormValues(data)
    });
  }

  //this function is used to patch form value
  setFormValues(faqDetail: any) {
    this.faqForm.patchValue({
      question: faqDetail?.data?.question,
      answer: faqDetail?.data?.answer,
      uuid: faqDetail?.data?.id,
    });
  }

  back() {
    this.location.back();
  }

}
