import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Error } from 'src/app/shared/models/error.model';
import { ContactUsService } from '../contact-us.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private translate: TranslateService, private contactUsService: ContactUsService, private toastr: ToastrService) { }
  @Input() contactUsDetailsId: any;
  @Input() emailSubject: string;
  message: string;
  errorMessage: string;

  ngOnInit(): void {
  }

  sendData() {
    const data = {
      contact_id: this.contactUsDetailsId,
      response_subject: this.emailSubject,
      closing_message: this.message
    }
    this.contactUsService.sendMail(data).subscribe({
      next: (resp: any) => {
        this.activeModal.dismiss('sent')
      },
      error: (errorRes: Error) => {
        const error = errorRes.error;
        if (error?.error?.length) {
          this.toastr.error(error.error[0]);
        } else {
          const message = this.translate.instant("Something Went Wrong Please Try again later")
          this.toastr.error(message);
        }
      }
    })
  }

}
