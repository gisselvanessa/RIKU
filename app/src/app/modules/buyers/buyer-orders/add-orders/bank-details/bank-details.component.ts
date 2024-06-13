import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { getFileType } from 'src/app/shared/helpers/file-helper';


@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})

export class BankDetailsComponent implements OnInit {

  constructor(private toastr: ToastrService, private translate: TranslateService) { }
  isDocumentUploading: boolean;

  ngOnInit(): void {
  }

  onDocumentChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          this.toastr.error(this.translate.instant('File size must be smaller than 5 MB'));
          this.isDocumentUploading = false;
          return;
        }
        const fileType = file.type;
        if (
          fileType != 'image/png' &&
          fileType != 'image/jpeg' &&
          fileType != 'application/pdf'
        ) {
          this.toastr.error(this.translate.instant('Allowed file type is only PDF, PNG'));
          return;
        }
        this.isDocumentUploading = true;
      }
    }
  }

  getFileType(url: string) {
    return getFileType(url);
  }

}
