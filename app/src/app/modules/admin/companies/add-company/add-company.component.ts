import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from "ngx-toastr";

import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { Error } from 'src/app/shared/models/error.model';
import { CompaniesService } from '../companies.service';
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  companyNameForm: FormGroup;
  companyNameFormControls: any;
  loading: boolean = false;

  constructor(
    private fb:FormBuilder,
    private companiesService:CompaniesService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    //we initialize the add company form at here
    this.companyNameForm = this.fb.group({
      company_name: ['',Validators.required]
    })

    //set the from controls to forms
    this.companyNameFormControls = this.companyNameForm.controls;
  }

  //this function is used to add companies
  addCompany(){
    if(!this.companyNameForm.valid){
      this.companyNameForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.companiesService.addCompany(this.companyNameForm.value).subscribe({
      next: () => {
        this.companyNameForm.reset();
        this.loading = false;
        this.activeModal.dismiss('confirm')
        const modalRef = this.modalService.open(SuccessfullComponent, {
          windowClass: 'delete-vehicle-modal ',
        });
        modalRef.componentInstance.companyAdded = true;
      },
      error: (errorRes:Error) => {
        const error = errorRes.error;        
        this.loading = false;
        if (error?.error?.length) {          
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
    });
  }
}
