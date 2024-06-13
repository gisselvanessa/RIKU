import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { Error } from 'src/app/shared/models/error.model';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-activate-deactivate',
  templateUrl: './activate-deactivate.component.html',
  styleUrls: ['./activate-deactivate.component.scss']
})
export class ActivateDeactivateComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal, 
    private modalService: NgbModal,
    private toastr: ToastrService,
    private blogService: BlogService,
    private translate:TranslateService
  ) { }

  @Input() blogData: any;
  loading: boolean = false;
  
  ngOnInit(): void { }

  onSubmit() {
    if (this.blogData?.id) {
      this.loading = true;
      this.blogService.publish(this.blogData).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.activeModal.dismiss('confirm')
          const modalRef = this.modalService.open(SuccessfullComponent, {
            windowClass: 'delete-vehicle-modal ',
          });
          modalRef.componentInstance.blogStatus = true;
          modalRef.componentInstance.blogStatusType = this.blogData.is_published;
          modalRef.componentInstance.deleteSuccessBtnText = "OK";
        },
        error: (errorRes: Error) => {
          const error = errorRes.error;
          this.loading = false;
          if (error?.error?.length) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant("Something Went Wrong Please Try again later")
            this.toastr.error(message);
          }
        }
      });
    }

  }

}
