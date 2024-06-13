import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamMembersService {

  constructor(private http: HttpClient) { }

  public isTeamMemberDeleted = new BehaviorSubject<any>(false);
  getDeletedTeamMember = this.isTeamMemberDeleted.asObservable();

  public getCompanyList() {
    return this.http.get<any>(`${environment.apiURL}/admin/company`);
  }
  public getRoleList() {
    return this.http.get<any>(`${environment.apiURL}/admin/company/role`);
  }

  public postTeamMembers(teamMembersData: any) {
    return this.http.post<any>(`${environment.apiURL}/admin/company/member`, teamMembersData)
  }

  public getTeamMember(filter: any) {
    let companyArr = filter.company;
    let company = ''
    let companyRoleArr = filter.companyRole
    let companyRole = ''
    if (filter.company) {
      for (let i = 0; i < companyArr.length; i++) {
        company += `company[${i}]=${companyArr[i]}&`
      }
      delete filter.company;
    }
    if (filter.companyRole) {
      for (let i = 0; i < companyRoleArr.length; i++) {
        companyRole += `companyRole[${i}]=${companyRoleArr[i]}&`
      }
      delete filter.companyRole;
    }
    const baseRoute = "/admin/company/member?";
    if (company) company = company.slice(0,-1);
    if (companyRole)  companyRole = companyRole.slice(0,-1);
    if(company && companyRole){
      company = company + "&"
    }
    
    return this.http.get<any>(`${environment.apiURL}${baseRoute}${company}${companyRole}`, { params: filter })
  }

  public getTeamMemberDeatils(id: any) {
    return this.http.get<any>(`${environment.apiURL}/admin/company/member/${id}`)
  }

  public putTeamMemberDetails(updatedDetails: any) {
    return this.http.put<any>(`${environment.apiURL}/admin/company/member`, updatedDetails)
  }

  public deleteTeamMember(id: any) {
    return this.http.delete<any>(`${environment.apiURL}/admin/company/member/${id}`)
  }

  public activateDeactivateMember(status: any) {
    return this.http.patch(`${environment.apiURL}/admin/company/member/change-status`, status)
  }
}
