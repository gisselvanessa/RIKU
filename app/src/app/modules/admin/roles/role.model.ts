export class ModulePermission{
  can_list: boolean;
  can_view_details: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_export: boolean;
}

export class Permission {
  module_name: string;
  module_display_name: string;
  module_permissions: ModulePermission
}

export class Role{
  role_id?: string;
  role_name: string;
  permissions: Array<Permission> = [];
  created_at: Date;
  id?: string;
  is_active: boolean;
}

export class ErrorResponse{
  error:{
    message: string;
    data: any;
    error: Array<string>;
    error_code: string;
  }
}


export class Pagination{
  total_pages: number;
  current_page: number;
  items_per_page: number;
}

export class RoleListResponse{
  data:{
    items: Array<Role>;
    pagination: Pagination;
  };
  message: string;
  success_code: string
}


export class APIResponse{
  data: any;
  message: string;
  success_code: string
}



