import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from '../roles.service';


@Component({
  selector: 'app-delete-role',
  templateUrl: './delete-role.component.html',
  styleUrls: ['./delete-role.component.scss']
})
export class DeleteRoleComponent implements OnInit, OnDestroy {

  @Input() public roleId: string;

  loading: boolean = false;
  errorMessage: string;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private rolesService: RolesService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.rolesService.deleteRole(this.roleId).subscribe((resp: any) => {
      this.activeModal.close(true);
    }, (error) => {
      this.activeModal.dismiss(error);
    }
    )
  }

  ngOnDestroy() {
  }


}
