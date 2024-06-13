import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-delete-usertype',
  templateUrl: './delete-usertype.component.html',
  styleUrls: ['./delete-usertype.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteUsertypeComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translate:TranslateService
  ) { }
  @Input() deleteSuccessBtnText: string;
  @Input() public userId: any;
  @Input() userType: any[] = [];
  loading: boolean = false;
  userTypeForm: FormGroup;
  ngOnInit(): void {
    this.createForm()
  }


  createForm() {
    this.userTypeForm = this.fb.group({
      type: this.fb.array([], [Validators.required])
    })
  }

  onCheckValue(event: any) {
    const formArray: FormArray = this.userTypeForm.get('type') as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    }
    else {
      let i: number = 0;
      formArray.controls.forEach((resp: AbstractControl) => {
        if (resp.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      })
    }
  }

  onSubmit() {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.isFromAdmin = true;
    const message = this.translate.instant("Back to User Listing")
    modalRef.componentInstance.deleteSuccessBtnText = message;
    modalRef.componentInstance.user_type = this.userTypeForm.value.type;
    this.activeModal.dismiss()
  }

}
