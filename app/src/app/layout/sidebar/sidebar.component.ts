import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/shared/services/auth.service';
import { AdminService } from 'src/app/modules/admin/admin-login/admin.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { ModuleName, UserPermission } from 'src/app/modules/admin/permission.model';

import { Error } from 'src/app/shared/models/error.model';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  constructor(private authService: AuthService, private adminService: AdminService, public router: Router,
    private userPermissionService: UserPermissionService, private toastr:ToastrService, private translate: TranslateService) { }
  isSideBarOpen = true;
  selectedAccordian: boolean = false;
  userPermissions: Array<UserPermission> = [];
  modulePermissions: any;
  moduleName = ModuleName;

  ngOnInit(): void {
    this.router.events.subscribe((event:any) => {
      if(event instanceof NavigationStart) {
        if((event.url.indexOf('/blog') > -1) || (event.url.indexOf('/faq') > -1) || (event.url.indexOf('/cms-pages') > -1)){
          this.selectedAccordian = true;
        }else{
          this.selectedAccordian = false;
        }
      }
    });

    this.getUserPermissions();
  }

  getUserPermissions(){
    this.userPermissionService.getUserPermissions().subscribe({
      next: (res: any) => {
        if(res.data.permissions.length > 0){
          this.modulePermissions = [];
          res.data.permissions.forEach((permission: UserPermission)=>{
            this.modulePermissions[permission.module_name] = permission.module_permissions;
          })
        }
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong Please Try again later'));
        }
      }
    });


  }

  openDropdown() {
    this.selectedAccordian = !this.selectedAccordian;
  }

  logout() {
    this.authService.removeAccessToken();
    const isRememberMe = this.adminService.getRememberAdmin();
    localStorage.clear();
    isRememberMe ? this.adminService.rememberAdmin(isRememberMe) : false;
    this.authService.changeLoggedIn(false);
    this.router.navigate(['/admin/login']);
  }

}
