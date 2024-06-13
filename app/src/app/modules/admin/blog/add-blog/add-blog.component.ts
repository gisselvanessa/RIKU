import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  CKEditor5,
  ChangeEvent,
  FocusEvent,
  BlurEvent,
} from '@ckeditor/ckeditor5-angular';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CustomSpecialCharValidators } from 'src/app/shared/helpers/validators';
import { BlogService } from '../blog.service';
// import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { environment } from 'src/environments/environment';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss'],
})
export class AddBlogComponent implements OnInit, AfterViewInit {
  env = environment;
  public Editor = ClassicEditor as unknown as {
    create: any;
  };
  public editorData = '';

  blogId: string;
  blogForm: FormGroup;
  blogFormControls: any;
  isFormSubmitted: boolean = false;
  isDisableSubmit: boolean = false;
  today = new Date();
  chipsArr: string[] = [];
  selectedTab = 'image';
  isImageUploading: boolean = false;
  isVideoUploading: boolean = false;

  blogMediaArr: Array<any> = [];

  isLegalDocumentUploading: boolean = false;
  isProfileImageUploading: boolean = false;

  profileImageURL: string | null;
  dealerLegalDocuments: Array<any> = [];

  @ViewChild('chipInput') chipInput: ElementRef<any>;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private location: Location,
    private blogService: BlogService,
    private modalService: NgbModal,
    private fileUploadService: FileUploadService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.blogId = this.actRoute.snapshot.params['id'] || '';
    this.createForm();
  }

  ngAfterViewInit(): void { }

  createForm() {
    try {
      this.blogForm = this.fb.group({
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            // CustomSpecialCharValidators.specialCharValidator,
          ],
        ],
        tags: ['', [Validators.required]],
        html: ['', [Validators.required]],
        blog_image: ['', [Validators.required]],
        is_published: [true],
        youtubeurl: [],
        blog_video: [],
      });

      this.blogFormControls = this.blogForm.controls;
    } catch (error) { }
  }

  addUpdateBlog() {
    this.isFormSubmitted = true;
    if (this.blogForm.invalid) {
      return;
    }
    this.isDisableSubmit = true;
    const userData = { ...this.blogForm.value };
    userData.asset_type = this.selectedTab === 'youtube_url' ? 'video' : this.selectedTab;
    if (this.blogMediaArr.length > 0) {
      userData.asset_key = this.blogMediaArr[0].key;
    }

    if (this.selectedTab === 'youtube_url') userData.asset_key = userData.youtubeurl;
    userData.tags = this.chipsArr;

    delete userData.blog_image;
    delete userData.blog_video;
    delete userData.youtubeurl;

    this.blogService
      .addBlog(userData)
      .pipe()
      .subscribe(
        (response: any) => {
          this.isFormSubmitted = false;
          this.isDisableSubmit = false;
          this.blogForm.reset();
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'add-blog-modal ',
          });
          modalRef.componentInstance.addBlogSuccess = true;
          const message = this.translate.instant("Back to Blog Listing")
          modalRef.componentInstance.addBlogSuccessBtnText = message;
        },
        ({ error, status }) => {
          if (error.error[0]) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);
          }
        }
      );
  }

  addChip(chips: any, event: any) {
    if (event.keyCode == 13) {
      if (this.chipsArr.length > 11) {
        const message = this.translate.instant("maximum tag limit reached")
        this.toastr.error(message);
        return;
      }
      if (chips) {
        let chipsSearch = this.chipsArr.findIndex((a) => a === chips);
        if (chipsSearch === -1) {
          this.chipsArr.push(chips);
          this.blogForm.controls['tags'].clearValidators();
          this.blogForm.controls['tags'].updateValueAndValidity();
          this.chipInput.nativeElement.value = '';
        }
      }
    }
  }

  removeChip(index: number) {
    this.chipsArr.splice(index, 1);
    if (!this.chipsArr.length) {
      this.blogForm.controls['tags'].setValidators([Validators.required]);
      this.blogForm.controls['tags'].updateValueAndValidity();
    }
  }

  public async onBlogCustomVideoChange(event: any) {
    let files = event.target.files;

    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 15360) {
          const message = this.translate.instant("File size must be smaller than 15 MB")
          this.toastr.error(message);
          this.isVideoUploading = false;
          return;
        }
        const fileType = file.type;
        if (fileType != 'video/mp4' && fileType != 'video/webm') {
          const message = this.translate.instant("Allowed file type is only MP4/webm")
          this.toastr.error(message);
          return;
        }
        this.isVideoUploading = true;
        await this.getPreSignedUrl(file, 'video', index, files.length)
          .then((success) => {
            if (success) {
              if (index == files.length - 1) {
                this.isVideoUploading = false;
              }
            }
            index++;
          })
          .catch((error) => {
            this.isVideoUploading = false;
            return;
          });
      }
    }
  }

  // this function is called when RUC Document modified
  public async onBlogImageChange(event: any) {
    let files = event.target.files;
    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 5120) {
          const message = this.translate.instant("File size must be smaller than 5 MB")
          this.toastr.error(message);
          this.isImageUploading = false;
          return;
        }
        const fileType = file.type;
        if (fileType != 'image/png' && fileType != 'image/jpeg') {
          const message = this.translate.instant("Allowed file type is only PNG, JPEG")
          this.toastr.error(message);
          return;
        }
        this.isImageUploading = true;
        await this.getPreSignedUrl(file, 'image', index, files.length)
          .then((success) => {
            if (success) {
              if (index == files.length - 1) {
                this.isImageUploading = false;
              }
            }
            index++;
          })
          .catch((error) => {
            this.isImageUploading = false;
            return;
          });
      }
    }
  }

  //this functiojn is called when ROC Document, Legal Document or Prfile pucture change
  getPreSignedUrl(
    file: any,
    inputName: string = 'image',
    index = 0,
    totalFiles = 0
  ) {
    return new Promise((resolve, reject) => {
      let preSignedURL: any;
      preSignedURL = this.fileUploadService.getPreSignedUrlForBlogImageVideo({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        asset_type: inputName,
      });

      preSignedURL.subscribe(
        async (res: any) => {
          if (res.data.url && res.data.key) {
            await this.fileUploadService
              .uploadFile(res.data.url, file)
              .pipe()
              .subscribe(
                (data) => {
                  this.blogMediaArr = [];
                  this.blogMediaArr.push({
                    key: res.data.key,
                    download_url: res.data.download_url,
                  });
                  resolve(true);
                },
                () => {
                  const message = this.translate.instant("Something Went Wrong Please Try again later")
                  this.toastr.error(message);
                  reject(true);
                }
              );
          }
        },
        (error: any) => {
          if (error.error.error[0]) {
            this.isProfileImageUploading = false;
            this.toastr.error(error.error.error[0]);
          } else {
            this.isProfileImageUploading = false;
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);
          }
        }
      );
    });
  }

  //this function is used to dele ROC Document
  deleteBlogMedias(index: number, typeM: string) {
    this.blogMediaArr.splice(index, 1);
    if (this.blogMediaArr.length === 0) {
      if (typeM == 'image')
        this.blogForm.patchValue({ blog_image: null });
      else
        this.blogForm.patchValue({ blog_video: null });
    }
  }

  selectedtab(tabName: string) {
    this.selectedTab = tabName;

    if (this.selectedTab == 'photo') {
      this.blogForm.controls['blog_image'].setValidators([Validators.required]);
      this.blogForm.controls['blog_video'].clearValidators();
      this.blogForm.controls['youtubeurl'].clearValidators();
      this.blogForm.controls['youtubeurl'].setValue('');
      this.blogMediaArr = [];
    } else if (this.selectedTab == 'video') {
      this.blogForm.controls['blog_video'].setValidators([Validators.required]);
      this.blogForm.controls['blog_image'].clearValidators();
      this.blogForm.controls['youtubeurl'].clearValidators();
      this.blogForm.controls['youtubeurl'].setValue('');
      this.blogMediaArr = [];
    } else if (this.selectedTab == 'youtube_url') {
      this.blogForm.controls['youtubeurl'].setValidators([Validators.required]);
      this.blogForm.controls['blog_image'].clearValidators();
      this.blogForm.controls['blog_video'].clearValidators();
      this.blogMediaArr = [];
    }

    this.blogForm.controls['blog_image'].updateValueAndValidity();
    this.blogForm.controls['blog_video'].updateValueAndValidity();
    this.blogForm.controls['youtubeurl'].updateValueAndValidity();

  }

  //this function is used to get file extension using the helper function getFileType(parameter)
  getFileType(url: string) {
    return getFileType(url);
  }

  onChange($event: any): void { }

  onPaste($event: any): void { }

  back() {
    this.location.back();
  }
}
