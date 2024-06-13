import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/shared/modals/delete-confirmation/delete-confirmation.component';
import { SuccessfullComponent } from 'src/app/shared/modals/successfull/successfull.component';
import { UserPermissionService } from 'src/app/shared/services/user-permission.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivateDeactivateComponent } from '../../admin-users/activate-deactivate/activate-deactivate.component';
import { ModulePermissions, UserPermission } from '../../permission.model';
import { Company } from '../models/company.model';
import { Role } from '../models/role.model';
import { TeamMemberDetails } from '../models/team-member-model';
import { TeamMembersService } from '../team-members.service';

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss']
})
export class AddMembersComponent implements OnInit {


  constructor(private fb: FormBuilder, private translate: TranslateService, private location: Location, private userService: UserService, private userPermissionService: UserPermissionService, private modalService: NgbModal, private teamMembersService: TeamMembersService, private activateRoute: ActivatedRoute, private toastr: ToastrService) { }

  memberForm: FormGroup;
  separateDialCode = false;
  teamMemberDetail: TeamMemberDetails = new TeamMemberDetails();
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  roleList: Array<Role> = [];
  selectedRole: string;
  selectedRoleId: string;
  companyList: Array<Company> = [];
  selectedCompany: string;
  selectedCompanyId: string;
  teamMemberId: string;
  permissionModule: Array<UserPermission>;
  modulePermissions: ModulePermissions = {} as ModulePermissions;


  ngOnInit(): void {
    this.teamMemberId = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.createTeamMemberForm()
    this.dropDownList()
    if (this.teamMemberId) {
      this.getTeamMember(this.teamMemberId);
    }
    this.userRolePermission()
  }
  userRolePermission() {
    if (this.userService.getUserType() === 'admin') {
      this.userPermissionService.getUserPermissions().subscribe((resp: any) => {
        this.permissionModule = resp.data.permissions
        const moduleNameIndex = this.permissionModule.findIndex((x: any) => x.module_name === 'team_management')
        this.modulePermissions = this.permissionModule[moduleNameIndex].module_permissions
      })
    } else {
      this.modulePermissions.can_create = true;
      this.modulePermissions.can_delete = true;
      this.modulePermissions.can_edit = true;
      this.modulePermissions.can_export = true;
      this.modulePermissions.can_list = true;
      this.modulePermissions.can_view_details = true;
    }
  }

  dropDownList() {
    forkJoin([this.teamMembersService.getCompanyList(), this.teamMembersService.getRoleList()]).pipe(map(([companyList, roleList]) => {
      this.companyList = companyList.data;
      this.roleList = roleList.data;
    })).subscribe()
  }
  getTeamMember(teamMemberId: string) {
    if (teamMemberId) {
      this.teamMembersService.getTeamMemberDeatils(teamMemberId).subscribe(
        (res: any) => {
          this.teamMemberDetail = res.data;
          this.setFormControlValues();
        },
        ({ error, status }) => {
          if (error) {
            this.toastr.error(error.error[0]);
          } else {
            const message = this.translate.instant('Something Went Wrong Please Try again later')
            this.toastr.error(message);
          }
        }
      );
    }

  }

  setFormControlValues() {
    this.memberForm.controls['first_name'].setValue(this.teamMemberDetail.first_name)
    this.memberForm.controls['last_name'].setValue(this.teamMemberDetail.last_name)
    this.memberForm.controls['email'].setValue(this.teamMemberDetail.email)
    this.selectedRole = this.teamMemberDetail.company_role[0].company_role_name
    this.memberForm.controls['company_role_id'].setValue(this.teamMemberDetail.company_role[0].company_role_id)
    this.selectedCompany = this.teamMemberDetail.company_role[0].company.company_name
    this.memberForm.controls['company_id'].setValue(this.teamMemberDetail.company_role[0].company.company_id)
    // let mobile_no = {
    //   dialCode: this.teamMemberDetail.country_code,
    //   number: this.teamMemberDetail.mobile_no
    // }
    this.memberForm.controls['mobile_no'].setValue(this.teamMemberDetail.country_code + this.teamMemberDetail.mobile_no)

  }


  deleteUser() {
    const modalRef = this.modalService.open(DeleteConfirmationComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.teamMemberId = this.teamMemberId
   const message = this.translate.instant('Back to Team Listing')
    modalRef.componentInstance.deleteSuccessBtnText = message;
  }

  createTeamMemberForm() {
    this.memberForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/
      ),]],
      mobile_no: ['', [Validators.required]],
      company_id: ['', Validators.required],
      company_role_id: ['', Validators.required],
    })
  }

  formatNumber(event: any) {
    let current: string = event.target.value;
    current = current.replace(/[^\d-+ ]/g, '');
    this.memberForm.controls['mobile_no'].setValue(current);

  }
  changeStatus(event: any) {
    const modalRef = this.modalService.open(ActivateDeactivateComponent, {
      windowClass: 'delete-vehicle-modal'
    })
    modalRef.componentInstance.teamMemberId = this.teamMemberId;
    const message = this.translate.instant('Back to Edit Team Member')
    modalRef.componentInstance.changeSuccessBtnText = message;
    modalRef.componentInstance.statusTeamMember = this.teamMemberDetail.status
    modalRef.componentInstance.active = event.target.checked;
    modalRef.result.then().catch((resp: any) => {
      if (resp === 'cancel' || resp === 0) {
        event.target.checked = !event.target.checked;
        this.teamMemberDetail.status = event.target.checked ? 'Active' : 'Inactive';
      } else if (resp === 'confirm') {
        this.getTeamMember(this.teamMemberId)
      }
    })

  }
  addUpdateMember() {
    this.memberForm.markAllAsTouched()
    if (this.memberForm.invalid) {
      return;
    } else {
      const data = { ...this.memberForm.value }
      data.country_code = data.mobile_no.dialCode;
      data.mobile_no = data.mobile_no.number.includes(data.country_code) ? data.mobile_no.number.replace(data.country_code, "") : data.mobile_no.number;

      if (this.teamMemberId) {
        let formData = {
          ...data,
          user_company_role_id: this.teamMemberDetail.company_role[0].user_company_role_id,
          user_id: this.teamMemberId
        }
        this.teamMembersService.putTeamMemberDetails(formData).subscribe((resp: any) => {
          if (resp.success_code === 'TEAM_MEMBER_UPDATED_SUCCESSFULLY') {
            const modalRef = this.modalService.open(SuccessfullComponent, {
              windowClass: 'delete-vehicle-modal'
            })
            const message=this.translate.instant("Team member updated successfully")
            modalRef.componentInstance.teamMemberaddedSuccess = message;
          }
        },
          ({ error, status }) => {
            if (error) {
              this.toastr.error(error.error[0]);
            } else {
              const message = this.translate.instant('Something Went Wrong Please Try again later')
              this.toastr.error(message);
            }
          }
        )
      } else {
        this.teamMembersService.postTeamMembers(data).subscribe((resp: any) => {
          if (resp.success_code === 'TEAM_MEMBER_CREATED_SUCCESSFULLY') {
            const modalRef = this.modalService.open(SuccessfullComponent, {
              windowClass: 'delete-vehicle-modal'
            })
            const message=this.translate.instant("Team member added successfully")
            modalRef.componentInstance.teamMemberaddedSuccess = message;
          }
        },
          ({ error, status }) => {
            if (error) {
              this.toastr.error(error.error[0]);
            } else {
              const message = this.translate.instant('Something Went Wrong Please Try again later')
              this.toastr.error(message);
            }
          })
      }
    }

  }
  clearCountrySearchBox() {
    const inputElement = document.getElementById("country-search-box") as HTMLInputElement;
    if (inputElement && inputElement.value) {
      inputElement.value = '';
    }
  }

  setRole(role: any) {
    this.selectedRole = role.name
    this.selectedRoleId = role.uuid
    this.memberForm.controls['company_role_id'].setValue(this.selectedRoleId)
  }
  setCompany(company: any) {
    this.selectedCompany = company.name
    this.selectedCompanyId = company.uuid
    this.memberForm.controls['company_id'].setValue(this.selectedCompanyId)

  }

  back() {
    this.location.back()
  }


}
