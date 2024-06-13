export class UserPermission {
  module_name: string;
  module_display_name: string;
  module_permissions: {
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_list: boolean;
    can_view_details: boolean;
    can_export: boolean;
  }
}

export class ModulePermissions {
  can_list: boolean = false;
  can_view_details: boolean = false;
  can_create: boolean = false;
  can_edit: boolean = false;
  can_delete: boolean = false;
  can_export: boolean = false;
}


export enum ModuleName {
  ExpertManagement = 'expert_management',
  ProcedureManagement = 'vehicle_procedure',
  OrderManagement = 'order_management',
  UserManagement = 'user_management',
  VehicleManagement = 'vehicles',
  TeamManagement = 'team_management',
  RoleManagement = 'role_management',
  CompanyManagement = 'company_management',
  Dashboard = 'dashboard',
  ContactUs = 'contact_us_management',
  CMS = 'cms_management',
  ActivityLog = 'activity_log_management',
  LoanManagement = 'loan_management'
}
