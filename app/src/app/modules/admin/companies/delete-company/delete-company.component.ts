import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesService } from '../companies.service';
import { ToastrService } from "ngx-toastr";
import { Error } from 'src/app/shared/models/error.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-company',
  templateUrl: './delete-company.component.html',
  styleUrls: ['./delete-company.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeleteCompanyComponent implements OnInit {
  
  //copany id getting as input
  @Input() public companyId: string;

  //loading variable
  loading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal, 
    private companiesService:CompaniesService,
    private toastr:ToastrService, private translate:TranslateService) { }

  ngOnInit(): void { }

  //this funtion is used to get delete company
  onDelete() {
    this.loading = true;
    this.companiesService.deleteCompany(this.companyId).subscribe({
      next: () => {
        this.activeModal.close(true)
        this.loading = false;
      },
      error: (errorRes:Error) => {
        const error = errorRes.error; 
        this.loading = false;
        this.activeModal.close(false)
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);
        }
      }
    });
  }

}
