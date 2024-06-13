import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { UserService } from 'src/app/shared/services/user.service';
import { AdminProfileDetails } from '../admin-profile-model';
import { AdminProfileService } from '../admin-profile.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})

export class ViewProfileComponent implements OnInit {

  constructor(private userService: UserService, private http: HttpClient,
  private adminProfileService: AdminProfileService, private toastr: ToastrService,
  private translate: TranslateService) { }
  loggedInUserType: string = '';
  userDetails: AdminProfileDetails;
  loading: boolean = false;
  @ViewChild('userPdf')
  userPdf!: ElementRef;
  fileName: string;
  public imageSrcForProfile: string = '';

  ngOnInit(): void {
    this.loggedInUserType = this.userService.getUserType();
    this.getProfileDetails()
  }

  getProfileDetails() {
    this.loading = true;
    this.adminProfileService.getAdminProfileDeatils().subscribe({
      next: (resp) => {
        this.loading = false;
        this.userDetails = resp.data ? resp.data : new AdminProfileDetails();
        // this.imageSrcForProfile = this.userDetails?.profile_img
        if (this.userDetails.profile_img) {
          this.imageSrcForProfile = this.userDetails.profile_img;
          // this.http.get(this.userDetails.profile_img, {
          //   observe: 'response',
          //   responseType: 'blob',
          // })
          //   .subscribe({
          //     next: (res) => {
          //       var reader = new FileReader();
          //       const that = this;
          //       reader.onload = function (event) {
          //         that.imageSrcForProfile = event.target?.result as any;
          //       };
          //       reader.readAsDataURL(res.body!);
          //     },
          //   });
        }
        this.fileName = (this.userDetails.first_name + this.userDetails.last_name)
      },
      error: (errorRes: Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          this.toastr.error(this.translate.instant('Something Went Wrong, Please Try again later'));
        }
      }
    })
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

}
