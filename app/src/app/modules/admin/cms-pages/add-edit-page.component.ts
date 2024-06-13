import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AdminContentManagementService } from './admin-content-management.service';
import { AdminContentManagement } from './admin-content-management.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { environment } from 'src/environments/environment';
import { CMSPages } from '../../../shared/constant/cms-pages-contants';
import { TranslateService } from '@ngx-translate/core';
import { ModuleName, ModulePermissions, UserPermission } from '../permission.model';


@Component({
  selector: 'app-add-edit-page',
  templateUrl: './add-edit-page.component.html',
  styleUrls: ['./add-edit-page.component.scss']
})

export class AddEditPageComponent implements OnInit {

  mycontent: string;
  contentId: string;
  contentForm: FormGroup;
  titleName: string;
  contentDetails: AdminContentManagement = new AdminContentManagement();
  type: string;
  qryParams: string;
  loading: boolean = false;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  /**ck editior variables */
  env = environment;
  public Editor = ClassicEditor as unknown as {
    create: any;
  };
  public editorData = '';
  /**ck editior variables */

  constructor(
    private actRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private adminContentManageService: AdminContentManagementService,
    private translate: TranslateService
  ) {
    /**
     * when we reload page with different route then its only relaod but ngoninit() not called again
     * due to component is not initialized again. this code helps to do that.
     */
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit(): void {
    this.createDetailsForm();
    this.actRoute.queryParams.subscribe((params: Params) => {
      this.qryParams = params['page'];
      if (this.qryParams) {
        this.getSetPageDetails(this.qryParams);
      }
    });

    if (this.actRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.actRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: UserPermission) => x.module_name == ModuleName.CMS);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }


  getSetPageDetails(page: string) {
    switch (page) {
      case 'privacy-policy':
        this.titleName = 'Privacy Policy';
        this.type = CMSPages.PRIVACY_POLICY;
        break;
      case 'terms':
        this.titleName = 'Terms & Conditions';
        this.type = CMSPages.TERMS;
        break;
      case 'payment-cancellation-policy':
        this.titleName = 'Payment and Cancellation Policy';
        this.type = CMSPages.PAYMENT_CANCELLATION_POLICY;
        break;
      case 'financing-policy':
        this.titleName = 'Financing Policy';
        this.type = CMSPages.FINANCING_POLICY;
        break;
      case 'faqs':
        this.titleName = 'FAQs';
        this.type = CMSPages.FAQ;
        break;
      case 'home':
        this.titleName = 'Home';
        break;
      case 'about-us':
        this.titleName = 'About Us';
        break;
      case 'sell':
        this.titleName = 'I Want To Sell';
        break;
      case 'payment-info':
        this.titleName = 'Payment Info';
        this.type = CMSPages.PAYMENT_INFO;
        break;
      default:
        this.titleName = 'Home';
        break;
    }
    this.getContent(this.type);
  }

  getContent(type: string) {
    if (type) {
      this.loading = true;
      this.adminContentManageService.getContentDetails(type).subscribe(
        (res: any) => {
          this.contentDetails = res.data;

          if (this.contentDetails.sub_title)
            this.contentForm.controls['sub_title'].setValue(
              this.contentDetails.sub_title
            );
          else this.contentForm.controls['sub_title'].setValue('');

          this.contentForm.controls['html'].setValue(this.contentDetails.html);
          this.loading = false;
        },
        ({ error, status }) => {
          this.loading = false;

          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant('Something Went Wrong Please Try again later')
            this.toastr.error(message);
          }
        }
      );
    }
  }

  createDetailsForm() {
    this.contentForm = this.fb.group({
      sub_title: [''],
      html: ['', Validators.required],
    });
  }

  addUpdateDetails() {
    this.contentForm.markAllAsTouched();
    if (this.contentForm.invalid) {
      return;
    } else {
      const data = { ...this.contentForm.value };
      if (this.type) {
        let formData = {
          ...data,
          type: this.type,
        };
        delete formData.sub_title;
        this.adminContentManageService.postContentDetails(formData).subscribe(
          (resp: any) => {
            // const message = this.translate.instant("Added policy details.")
            // const message = "Added policy details."
            if (resp.success_code == "ADDED_POLICY_DETAILS") {
              const modalRef = this.modalService.open(SuccessfullComponent, {
                windowClass: 'update-static-content-modal',
              });
              const contentMessage = this.translate.instant("Content updated successfully")
              modalRef.componentInstance.contentUpdatedSuccess =
                contentMessage;
              modalRef.componentInstance.contentType = this.qryParams;
            }
          },
          ({ error, status }) => {
            if (error) {
              this.toastr.error(error.error[0]);
            } else {
              const message = this.translate.instant('Something Went Wrong Please Try again later')
              this.toastr.error(message);
            }
          }
        );
      }
    }
  }

  back() {
    this.location.back();
  }

}
