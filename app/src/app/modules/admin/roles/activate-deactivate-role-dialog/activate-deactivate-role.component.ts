import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from '../roles.service';


@Component({
  selector: 'app-activate-deactivate-role',
  templateUrl: './activate-deactivate-role.component.html',
  styleUrls: ['./activate-deactivate-role.component.scss']
})
export class ActivateDeactivateRoleComponent implements OnInit, OnDestroy {

  @Input() public roleId: string;
  @Input() public isActivate: boolean;

  loading: boolean = false;
  errorMessage: string;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private  rolesService: RolesService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.rolesService.updateStatus({ is_active: this.isActivate, role_id: this.roleId }).subscribe((resp: any) => {
      this.activeModal.close(true);
    }, (error) => {
      this.activeModal.dismiss(error);
    }
    )
  }

  ngOnDestroy() {
    this.activeModal.close(false);
  }

}
