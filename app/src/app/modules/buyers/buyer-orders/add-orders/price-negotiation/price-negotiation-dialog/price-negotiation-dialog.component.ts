import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-price-negotiation-dialog',
  templateUrl: './price-negotiation-dialog.component.html',
  styleUrls: ['./price-negotiation-dialog.component.scss']
})

export class PriceNegotiationDialogComponent implements OnInit, OnDestroy {

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.activeModal.close(true);
  }

  ngOnDestroy() {
  }
}
