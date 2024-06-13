import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ModulePermission, Permission } from './role.model';

@Injectable({
  providedIn: 'root'
})

export class RolesService {

  public baseURL: string = environment.adminApiURL;

  constructor(private http: HttpClient) { }

  //this is used to get companies list
  public getRoleList(params: any) {
    return this.http.get<any>(`${this.baseURL}/roles`, { params: params });
  }
  //this function is used to call add company
  public addRole(data: any) {
    return this.http.post<any>(`${this.baseURL}/roles`, data);
  }

  public updateRole(data: any) {
    return this.http.put<any>(`${this.baseURL}/roles`, data);
  }

  //this is used to get role and their permissin list
  public getRole(roleId: string) {
    return this.http.get<any>(`${this.baseURL}/role/permission/${roleId}`)
  }

  public deleteRole(roleId: string) {
    return this.http.delete(`${this.baseURL}/roles/${roleId}`)
  }

  public updateStatus(data: { role_id: string, is_active: boolean }) {
    return this.http.post(`${this.baseURL}/roles/change-status`, data)
  }

  public getTeamMembersByRole(paramString: string, params: any) {
    return this.http.get(`${this.baseURL}/company/member?${paramString}`, { params: params })
  }

  public getModuleAndPermissions(): Array<Permission> {
    return [
      {
        module_name: 'dashboard',
        module_display_name: 'Dashboard',
        module_permissions: {
          can_list: false,
          can_export: false,
          can_create: false,
          can_view_details: false,
          can_edit: false,
          can_delete: false,
        }
      },
      {
        module_name: 'user_management',
        module_display_name: 'User Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'vehicles',
        module_display_name: 'Vehicles',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'team_management',
        module_display_name: 'Team Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'company_management',
        module_display_name: 'Company Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'role_management',
        module_display_name: 'Role Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'order_management',
        module_display_name: 'Order Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'expert_management',
        module_display_name: 'Expert Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'vehicle_procedure',
        module_display_name: 'Vehicle Procedure',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'loan_management',
        module_display_name: 'Loan Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'cms_management',
        module_display_name: 'Content Management',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'contact_us_management',
        module_display_name: 'Manage Contact Us',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      },
      {
        module_name: 'activity_log_management',
        module_display_name: 'Activity Log',
        module_permissions: {
          can_list: false,
          can_view_details: false,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_export: false
        }
      }
    ]
  }
}
