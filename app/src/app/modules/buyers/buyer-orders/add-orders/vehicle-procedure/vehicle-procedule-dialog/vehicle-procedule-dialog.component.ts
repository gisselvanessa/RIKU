import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-vehicle-procedule-dialog',
  templateUrl: './vehicle-procedule-dialog.component.html',
  styleUrls: ['./vehicle-procedule-dialog.component.scss']
})
export class VehicleProceduleDialogComponent implements OnInit {
  isAgreed: boolean = false;
  step: number = 1;
  isAccept: boolean = false;
  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal,
    private toastr: ToastrService, private translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if(!this.isAgreed){
      this.toastr.warning(this.translate.instant('Please agree first!!'))
      return;
    }
    this.activeModal.close(true);
  }

  onAccept() {
    if(!this.isAccept){
      this.toastr.warning(this.translate.instant('Please agree first!!'))
      return;
    }
    this.activeModal.close(false);
  }

  onReject(){
    this.activeModal.close(false);
  }

  ngOnDestroy() {
  }

}
