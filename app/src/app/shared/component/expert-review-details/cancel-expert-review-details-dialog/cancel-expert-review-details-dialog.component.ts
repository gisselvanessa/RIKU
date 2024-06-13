import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { ExpertReviewService } from '../../expert-review/expert-review.service';

@Component({
  selector: 'app-cancel-expert-review-details-dialog',
  templateUrl: './cancel-expert-review-details-dialog.component.html',
  styleUrls: ['./cancel-expert-review-details-dialog.component.scss']
})
export class CancelExpertReviewDetailsDialogComponent implements OnInit {


  @Input() expertReviewId: string;
  loading: boolean = false;
  constructor(public activeModal: NgbActiveModal,private translate:TranslateService, private toastr: ToastrService,private expertReviewService:ExpertReviewService) { }

  ngOnInit(): void {
  }


  onSubmit() {
    this.loading = true;
    this.expertReviewService.cancelExpertReview(this.expertReviewId).subscribe({
      next: () => {
        this.loading = false;
        this.activeModal.close(true);
      },
      error: (errorRes:Error) => {
        this.loading = false;
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant('Something Went Wrong Please Try again later')
          this.toastr.error(message);        }
        this.activeModal.close(false);
      }
    });
  }

  

}
