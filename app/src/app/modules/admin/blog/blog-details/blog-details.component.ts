import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleName, ModulePermissions, UserPermission } from '../../permission.model';
import { Blog, BlogDetailResponse } from '../blog.model';
import { BlogService } from '../blog.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  blogId: string;
  blogDetails: Blog;
  isDataLoaded = false;
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private blogService: BlogService,
    private userService: UserService,
    private userPermissionService: UserPermissionService,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.blogId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.blogService.getBlogDetails(this.blogId).subscribe((resp: BlogDetailResponse) => {
      this.blogDetails = resp.data;
      this.isDataLoaded = true;
    })
    this.userRolePermission()
  }
  userRolePermission() {
    // if (this.userService.getUserType() === 'admin') {
    //   this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
    //     this.permissionModule = resp.data.permissions
    //     const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'team_management')
    //     this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions
    //   })
    // } else {
    //   this.modulePermissions.can_create = true;
    //   this.modulePermissions.can_delete = true;
    //   this.modulePermissions.can_edit = true;
    //   this.modulePermissions.can_export = true;
    //   this.modulePermissions.can_list = true;
    //   this.modulePermissions.can_view_details = true;
    // }

    if (this.activatedRoute.snapshot.data['modulePermissions']['data']) {
      const module = this.activatedRoute.snapshot.data['modulePermissions']['data']['permissions'].find((x: any) => x.module_name == ModuleName.CMS);
      this.modulePermissions = module ? module.module_permissions : new ModulePermissions();
    }
  }

  goback() {
    this.location.back()
  }

  editBlog() {
    this.router.navigate([`admin/blog/edit/${this.blogId}`])
  }

  embeddedUrl(url:any){
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    let youtubeUrl = (match && match[2].length === 11)
      ? match[2]
      : null;
    return 'https://www.youtube.com/embed/' + youtubeUrl;
  }

}
