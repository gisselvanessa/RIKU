import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { DeleteUsertypeComponent } from 'src/app/shared/modals/admin/delete-usertype/delete-usertype.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { AdminUsersService } from '../../../modules/admin/admin-users/admin-users.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserDetails } from 'src/app/shared/models/user-details.model';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { EditConfirmationComponent } from '../../modals/edit-confirmation/edit-confirmation.component';
import { ModulePermissions, UserPermission } from 'src/app/modules/admin/permission.model';
import { UserPermissionService } from '../../services/user-permission.service';
import { BecomeBuyerSellerComponent } from '../../modals/become-buyer-seller/become-buyer-seller.component';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})

export class UserDetailsComponent implements OnInit {
  constructor(
    private activateroute: ActivatedRoute,
    public userService: UserService,
    private userPermissionService: UserPermissionService,
    public authService: AuthService,
    private http: HttpClient,
    private location: Location,
    private adminUserService: AdminUsersService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  monthNames: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  userId: string;
  userType: string
  userDetails: UserDetails;
  @ViewChild('userPdf')
  userPdf!: ElementRef;
  fileName: string;
  public imageSrcForProfile: string;
  public imageSrcForRucDoc: any[] = [];
  public imageSrcForLegalDoc: any[] = [];
  isLoggedIn: boolean = false;
  becomeType: string;
  loggedInUserType: string = '';
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;

  ngOnInit(): void {
    this.loggedInUserType = this.userService.getUserType();
    if (this.loggedInUserType === 'admin' || this.loggedInUserType === 'super_admin') {
      this.userId = this.activateroute.snapshot.paramMap.get('id') || '';
      this.adminUserService.getUser(this.userId).subscribe((resp: any) => {
        this.userType = resp.data.user_type.map((x: any) => x.type);
        this.userDetails = resp.data;
        if (this.userDetails.profile_pic?.download_url) {
          this.http.get(this.userDetails.profile_pic?.download_url, {
            observe: 'response',
            responseType: 'blob',
          })
            .subscribe({
              next: async (res) => {
                var reader = new FileReader();
                reader.onload = (event) => {
                  this.imageSrcForProfile = event.target?.result as any;
                };
                reader.readAsDataURL(res.body!);
              },
            });
        }
        if (this.userDetails.ruc_doc) {
          this.userDetails.ruc_doc.forEach(async (rucDoc: any, i: number) => {
            await new Promise<void>((resolve, reject) => {
              this.http.get(this.userDetails.ruc_doc[i].download_url, {
                observe: 'response',
                responseType: 'blob',
              }).subscribe({
                next: (res) => {
                  resolve()
                  var reader = new FileReader();
                  const that = this;
                  reader.onload = function (event) {
                    that.imageSrcForRucDoc.push(event.target?.result as any)
                  };
                  reader.readAsDataURL(res.body!);
                }
              })
            })
          })
        }
        if (this.userDetails.legal_doc) {
          this.userDetails.legal_doc.forEach(async (legalDoc: any, i: number) => {
            await new Promise<void>((resolve, reject) => {
              this.http.get(this.userDetails.legal_doc[i].download_url, {
                observe: 'response',
                responseType: 'blob',
              }).subscribe({
                next: (res) => {
                  resolve()
                  var reader = new FileReader();
                  const that = this;
                  reader.onload = function (event) {
                    that.imageSrcForLegalDoc.push(event.target?.result as any)
                  };
                  reader.readAsDataURL(res.body!);
                }
              })
            })
          })
        }
        this.fileName = (this.userDetails.first_name + this.userDetails.last_name)
      })
    } else {
      this.userService.getMyProfileDetails().subscribe((resp: any) => {
        this.userType = resp.data.role.map((x: any) => x.type);
        this.userDetails = resp.data;
        if (this.userDetails.profile_pic?.download_url) {
          this.http.get(this.userDetails.profile_pic?.download_url, {
            observe: 'response',
            responseType: 'blob',
          })
            .subscribe({
              next: (res) => {
                var reader = new FileReader();
                const that = this;
                reader.onload = function (event) {
                  that.imageSrcForProfile = event.target?.result as any;
                };
                reader.readAsDataURL(res.body!);
              },
            });
        }
        if (this.userDetails.ruc_doc) {
          this.userDetails.ruc_doc.forEach(async (rucDoc: any, i: number) => {
            await new Promise<void>((resolve, reject) => {
              this.http.get(this.userDetails.ruc_doc[i].download_url, {
                observe: 'response',
                responseType: 'blob',
              }).subscribe({
                next: (res) => {
                  resolve()
                  var reader = new FileReader();
                  const that = this;
                  reader.onload = function (event) {
                    that.imageSrcForRucDoc.push(event.target?.result as any)
                  };
                  reader.readAsDataURL(res.body!);
                }
              })
            })
          })
        }
        if (this.userDetails.legal_doc) {
          this.userDetails.legal_doc.forEach(async (legalDoc: any, i: number) => {
            await new Promise<void>((resolve, reject) => {
              this.http.get(this.userDetails.legal_doc[i].download_url, {
                observe: 'response',
                responseType: 'blob',
              }).subscribe({
                next: (res) => {
                  resolve()
                  var reader = new FileReader();
                  const that = this;
                  reader.onload = function (event) {
                    that.imageSrcForLegalDoc.push(event.target?.result as any)
                  };
                  reader.readAsDataURL(res.body!);
                }
              })
            })

          })
        }
      })
    }
    this.userRolePermission()
  }

  userRolePermission() {
    if (this.userService.getUserType() === 'admin') {
      this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
        this.permissionModule = resp.data.permissions
        const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'user_management')
        this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions
      })
    } else {
      this.modulePermissions.can_create = true;
      this.modulePermissions.can_delete = true;
      this.modulePermissions.can_edit = true;
      this.modulePermissions.can_export = true;
      this.modulePermissions.can_list = true;
      this.modulePermissions.can_view_details = true;
    }
  }

  goback() {
    this.location.back()
  }

  editUser() {
    if (this.loggedInUserType === 'admin' || this.loggedInUserType === 'super_admin') {
      this.router.navigate([`admin/users/edit/${this.userId}`])
    } else if (this.loggedInUserType === 'buyer') {
      if (this.userDetails.role.length > 1) {
        this.openPopUp('buyer')
      } else {
        this.router.navigate([`buyer/edit-profile`])
      }
    } else if (this.loggedInUserType === 'seller') {
      if (this.userDetails.role.length > 1) {
        this.openPopUp('seller')
      } else {
        this.router.navigate([`seller/edit-profile`])
      }
    } else if (this.loggedInUserType === 'dealer') {
      this.router.navigate([`dealer/edit-profile`])
    } else if (this.loggedInUserType === 'user') {
      if (this.userDetails.role.length > 1) {
        this.openPopUp('user')
      } else {
        this.router.navigate([`user/edit-profile`])
      }
    } else if (this.loggedInUserType === 'dealer') {
      this.router.navigate([`user/edit-profile`])
    }
  }

  openPopUp(type: string) {
    const modalRef = this.modalService.open(EditConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.loggedInUserType = type
  }

  deleteUser() {
    if (this.userDetails.user_type.length > 1) {
      const modalRef = this.modalService.open(DeleteUsertypeComponent, {
        windowClass: 'delete-vehicle-modal'
      })
      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.isFromAdmin = true;
      modalRef.componentInstance.deleteSuccessBtnText = 'Back to User Listing';
      modalRef.componentInstance.userType = this.userType;


    } else {
      const modalRef = this.modalService.open(DeleteConfirmationComponent, {
        windowClass: 'delete-vehicle-modal'
      })

      modalRef.componentInstance.userId = this.userId;
      modalRef.componentInstance.isFromAdmin = true;
      modalRef.componentInstance.deleteSuccessBtnText = 'Back to User Listing';
      modalRef.componentInstance.user_type.push(this.userType)
    }
  }

  downloadUserDetails() {
    html2canvas(this.userPdf.nativeElement, { useCORS: true, scale: 2 }).then((successRef: any) => {
      var doc = new jsPDF('p', 'mm', 'a4');
      var img = successRef.toDataURL('image/png;base64');
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(
        img,
        'PNG',
        bufferX,
        bufferY,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
      return doc;
    })
      .then((doc: any) => doc.save(`${this.fileName}.pdf`));
  }
  getFileType(url: string): string {
    return getFileType(url);
  }

  getDate(dateString: any) {
    const datePart = dateString.match(/\d+/g),
      year = datePart[0], // get only two digits
      month = datePart[1], day = datePart[2];
    return day + '-' + this.monthNames[parseInt(month) - 1] + '-' + year;
  }

  openBseller(type: any) {
    this.becomeType = type;
    console.log(this.becomeType);
    const modalRef = this.modalService.open(BecomeBuyerSellerComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    modalRef.componentInstance.becomeType = this.becomeType;
    modalRef.result.then().catch((res: any) => {
      if (res) {
        this.userService.getMyProfileDetails().subscribe((resp: any) => {
          this.userType = resp.data.role.map((x: any) => x.type);
          this.userDetails = resp.data;
        });
      }
    })
  }
}
