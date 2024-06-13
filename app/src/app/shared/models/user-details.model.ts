export class UserDetails {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    user_id: string;
    status: string;
    mobile_no: number;
    country_code: string;
    company_name?: string;
    dob?: Date;
    role?: any = [{
        type: Array<string>,
        status: Array<string>
    }];
    email: string;
    gender: string;
    legal_doc?: any;
    profile_pic?: any = {
        download_url: Array<string>,
        key: Array<string>
    };
    registration_date?: any;
    ruc_doc?: any;
    user_type?: any = [{
        type: Array<string>,
        status: Array<string>
    }];
    vehicle_condition?: any[];
    vehicle_types?: any[];
    additional_address: string;
    address?: any = {
        province: Array<string>,
        city: Array<string>,
        parish: Array<string>,
        address: Array<string>
    }
}
