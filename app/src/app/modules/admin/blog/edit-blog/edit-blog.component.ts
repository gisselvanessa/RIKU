import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from '../blog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { getFileType } from 'src/app/shared/helpers/file-helper';
import {
  CKEditor5,
  ChangeEvent,
  FocusEvent,
  BlurEvent,
} from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { CustomSpecialCharValidators } from 'src/app/shared/helpers/validators';
import { Blog, BlogDetailResponse } from '../blog.model';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { ActivateDeactivateComponent } from '../activate-deactivate/activate-deactivate.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss'],
})
export class EditBlogComponent implements OnInit {
  env = environment;
  public Editor = ClassicEditor as unknown as {
    create: any;
  };
  public editorData = '';
  isPublished: boolean;

  blogId: string;
  blogForm: FormGroup;
  blogFormControls: any;
  isFormSubmitted: boolean = false;
  isDisableSubmit: boolean = false;
  chipsArr: Array<string> = [];
  selectedTab = '';
  isImageUploading: boolean = false;
  isVideoUploading: boolean = false;

  blogMediaArr: Array<any> = [];

  blogDetails: any;
  dataLoaded = false;

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
    // this.blogId = this.actRoute.snapshot.params['id'] || '';
    this.actRoute.params.subscribe((params: Params) => {
      this.blogId = params['id'];
    });

    this.createForm();
    this.getBlogDetails(this.blogId);
  }

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
        blog_image: [],
        youtubeurl: [],
        blog_video: [],
      });
      this.blogFormControls = this.blogForm.controls;
    } catch (error) { }
  }

  getBlogDetails(blogId: any) {
    if (blogId) {
      this.blogService.getBlogDetails(blogId).subscribe((res: BlogDetailResponse) => {
        this.blogDetails = res.data;
        this.isPublished = res.data.is_published;
        this.setFormValues(this.blogDetails)
      });
    }
  }

  //this function is used to patch form value
  setFormValues(blogDetail: Blog) {
    this.blogForm.patchValue({
      title: blogDetail?.title,
      html: blogDetail?.html,
      tags: blogDetail.tags
    })

    this.chipsArr = blogDetail.tags;

    const type = this.getType(blogDetail);
    this.selectedTab = type;
    if (type === 'youtube_url') {
      this.blogMediaArr.push({
        key: blogDetail?.cover_asset_url?.key,
        download_url: blogDetail?.cover_asset_url?.download_url,
      });
      this.blogForm.patchValue({
        youtubeurl: blogDetail?.cover_asset_url,
      });
      this.blogForm.controls['youtubeurl'].setValidators([Validators.required]);
      this.blogForm.controls['youtubeurl'].updateValueAndValidity();
    } else if (type === 'image') {
      this.blogMediaArr.push({
        key: blogDetail?.cover_asset_url?.key,
        download_url: blogDetail?.cover_asset_url?.download_url,
      });
      this.blogForm.controls['youtubeurl'].clearValidators();
      this.blogForm.controls['youtubeurl'].updateValueAndValidity();
    } else if (type === 'video') {
      this.blogMediaArr.push({
        key: blogDetail?.cover_asset_url?.key,
        download_url: blogDetail?.cover_asset_url?.download_url,
      });
      this.blogForm.controls['youtubeurl'].clearValidators();
      this.blogForm.controls['youtubeurl'].updateValueAndValidity();
    }
    this.dataLoaded = true;
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
    userData.id = this.blogId;
    userData.is_published = this.isPublished;
    delete userData.blog_image;
    delete userData.blog_video;
    delete userData.youtubeurl;

    this.blogService
      .updateBlogDetails(userData)
      .pipe()
      .subscribe(
        (response: any) => {
          this.isFormSubmitted = false;
          this.isDisableSubmit = false;
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'add-blog-modal ',
          });
          modalRef.componentInstance.editBlogSuccess = true;
          modalRef.componentInstance.isRedirection = true;
          modalRef.componentInstance.editBlogSuccessBtnText = this.translate.instant("Back to Blog Listing");
        },
        ({ error, status }) => {
          if (error.error[0]) {
            this.toastr.error(error.error[0]);
          } else {
            this.toastr.error(this.translate.instant("Something Went Wrong Please Try again later"));
          }
        }
      );
  }

  public async onBlogCustomVideoChange(event: any) {
    let files = event.target.files;

    if (files) {
      let index = 0;
      for (let file of files) {
        const totalBytes = file.size;
        const fileSize = Math.round(totalBytes / 1024);
        if (fileSize >= 15360) {
          this.toastr.error(this.translate.instant("File size must be smaller than 15 MB"));
          this.isVideoUploading = false;
          return;
        }
        const fileType = file.type;
        if (fileType != 'video/mp4' && fileType != 'video/webm') {
          this.toastr.error(this.translate.instant("Allowed file type is only MP4/webm"));
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
          this.toastr.error(this.translate.instant("File size must be smaller than 5 MB"));
          this.isImageUploading = false;
          return;
        }
        const fileType = file.type;
        if (fileType != 'image/png' && fileType != 'image/jpeg') {
          this.toastr.error(this.translate.instant("Allowed file type is only PNG, JPEG"));
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
                  this.toastr.error(this.translate.instant("Something Went Wrong Please Try again later"));
                  reject(true);
                }
              );
          }
        },
        (error: any) => {
          if (error.error.error[0]) {
            this.toastr.error(error.error.error[0]);
          } else {
            this.toastr.error(this.translate.instant("Something Went Wrong Please Try again later"));
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
    if (this.selectedTab == 'image') {
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

  addChip(chips: any, event: any) {
    if (event.keyCode == 13) {
      if (this.chipsArr.length > 11) {
        this.toastr.error(this.translate.instant("maximum tag limit reached"));
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

  //this function is used to get file extension using the helper function getFileType(parameter)
  getFileType(url: string) {
    return getFileType(url);
  }

  onChange($event: any): void { }

  onPaste($event: any): void { }

  back() {
    this.location.back();
  }

  getType(data: any) {
    if (this.selectedTab) return this.selectedTab;
    let type: string = "";
    const url: string = data?.cover_asset_url?.download_url;
    const isYoutube: boolean = !url ? true : false;
    return isYoutube ? 'youtube_url' : data.asset_type;
  }

  deleteBlog() {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal',
    });
    modalRef.componentInstance.blogId = this.blogId;
    modalRef.componentInstance.deleteSuccessBtnText = this.translate.instant("Back to Blog Listing");

    modalRef.result
      .then((result: boolean) => {
        if (result) {
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-blog-modal',
          });
          modalRef.componentInstance.singleBlogDeleted = true;
          modalRef.componentInstance.deleteSuccessBtnText = this.translate.instant("Back to Blog Listing");
          modalRef.result.then().catch((resp: any) => {
            this.router.navigate(['/admin/blog'])
          })
        }
      })
      .catch(() => {
      }); //don't remove catch() when user click in backdrop area then dismiss() will fire and error occured becaue we are using close() not dismiss()
  }

  makePublish(event: any) {
    let params: any = {};
    params.id = this.blogId;
    params.is_published = event.target.checked;
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.blogData = params;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'confirm') {
        this.isPublished = event.target.checked;
      } else {
        event.target.checked = !event.target.checked;
      }
    })
  }
}
