export class AdminProfileDetails {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    mobile_no: string;
    profile_img: string;
    created_date: string;
    status: boolean;
    role: Array<Role>;
    company_role: Array<CompanyRole>
}

export class CompanyRole {
    id: string;
    user_id: string;
    role_id: string;
    is_active: boolean;
    company_id: string;
    uuid: string;
    created_at: string;
    company: Company;
    company_role: RoleOfCompany
}

export class RoleOfCompany {
    id: string;
    uuid: string;
    name: string;
    is_active: boolean;
    created_at: string;
}

export class Company {
    id: string;
    user_id: string;
    uuid: string;
    name: string;
    created_at: string;
    is_deleted: boolean;
}

export class Role {
    id: string;
    user_id: string;
    role_id: string;
    created_at: string;
    is_active: boolean;
    is_deleted: boolean;
    role_user: RoleUser
}

export class RoleUser {
    id: string;
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
}
