import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { ManageExpertsService } from '../manage-experts.service';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { ExpertUserDetails } from '../manage-experts.model';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-expert-user-details',
  templateUrl: './expert-user-details.component.html',
  styleUrls: ['./expert-user-details.component.scss']
})

export class ExpertUserDetailsComponent implements OnInit {

  constructor(private manageExpertService: ManageExpertsService, private location: Location, private router: Router,
    private activateRoute: ActivatedRoute, private translate: TranslateService, private toastr: ToastrService) { }

  permissionModule: Array<UserPermission>;
  expertUserId: string;
  expertUserDetails: ExpertUserDetails;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  ngOnInit(): void {
    if (this.activateRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activateRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.ExpertManagement);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
    this.expertUserId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.getExpertDetails();
  }

  getExpertDetails() {
    if (this.expertUserId && this.expertUserId != '') {
      this.manageExpertService.getExpertUserDetails(this.expertUserId).pipe().subscribe((response: any) => {
        this.expertUserDetails = response.data;
        this.expertUserDetails.documents = this.expertUserDetails.documents.map((x: any) => x.download_url)
      }, (error) => {
        const message = this.translate.instant("Something Went Wrong Please Try again later")
        this.toastr.error(message);
        this.router.navigate(['/admin/experts']);
      })
    }
  }

  goback() {
    this.location.back()
  }

  editUser() {
    this.router.navigate([`admin/experts/edit/${this.expertUserId}`])
  }

  getFileType(url: string): string {
    return getFileType(url);
  }
}

