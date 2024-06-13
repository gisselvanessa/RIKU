import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { of } from "rxjs/internal/observable/of";
import { Permission } from "src/app/modules/admin/roles/role.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})

export class UserPermissionService {
    subRoleId: string | null;
    public baseURL: string = environment.adminApiURL;
    constructor(private router: Router, private http: HttpClient) { }

    setUserRoleId(subRoleId: string) {
      localStorage.setItem('subRoleId', subRoleId)
    }

    getUserPermissions() {
      this.subRoleId = localStorage.getItem('subRoleId');
      if (this.subRoleId) {
        return this.http.get<any>(`${this.baseURL}/role/permission/${this.subRoleId}`)
      } else {
        return of({
          data: {
            permissions: this.getModuleAndPermissions()
          }
        })
      }
    }

    public getModuleAndPermissions(): Array<Permission> {
      return [
        {
          module_name: 'dashboard',
          module_display_name: 'Dashboard',
          module_permissions: {
            can_list: true,
            can_export: true,
            can_create: true,
            can_view_details: true,
            can_edit: true,
            can_delete: true,
          }
        },
        {
          module_name: 'user_management',
          module_display_name: 'User Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'vehicles',
          module_display_name: 'Vehicles',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'team_management',
          module_display_name: 'Team Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'company_management',
          module_display_name: 'Company Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'role_management',
          module_display_name: 'Role Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'order_management',
          module_display_name: 'Order Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'expert_management',
          module_display_name: 'Expert Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'vehicle_procedure',
          module_display_name: 'Vehicle Procedure',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'loan_management',
          module_display_name: 'Loan Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'contact_us_management',
          module_display_name: 'Manage Contact Us',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'cms_management',
          module_display_name: 'Content Management',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        },
        {
          module_name: 'activity_log_management',
          module_display_name: 'Activity Log',
          module_permissions: {
            can_list: true,
            can_view_details: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_export: true
          }
        }
      ]
    }
}
