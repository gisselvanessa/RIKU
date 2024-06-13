import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Company } from '../companies.model';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit, OnDestroy {

  companyId: string;
  companyDetail: Company;
  loading:boolean = true;

  constructor(
    private activatedRoute:ActivatedRoute,
    private toastr: ToastrService,
    private router:Router,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.getCompanyDetails();
  }

  //this function is used to get company details
  getCompanyDetails(): void {
    this.companyId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    let companyDetail:any = (localStorage.getItem(this.companyId));
    this.companyDetail = JSON.parse(companyDetail);
    if(this.companyId !== this.companyDetail?.id){
      const message = this.translate.instant('Something Went Wrong Please Try again later')
      this.toastr.error(message);
      this.router.navigate(['/admin/companies']);
      this.loading = false;
    }else{
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem(this.companyId);
  }
}
