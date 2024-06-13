import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-confirmation',
  templateUrl: './edit-confirmation.component.html',
  styleUrls: ['./edit-confirmation.component.scss']
})
export class EditConfirmationComponent implements OnInit {

  constructor(private router: Router, public activeModal: NgbActiveModal) { }
  @Input() loggedInUserType: string;

  ngOnInit(): void {

  }

  proceed() {
    if (this.loggedInUserType === 'seller') {
      this.router.navigate([`seller/edit-profile`])
    } else if (this.loggedInUserType === 'buyer') {
      this.router.navigate([`buyer/edit-profile`])
    }
  }
}
