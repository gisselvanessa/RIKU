
export class Address{
    address: string;
    city: string;
    parish: string;
    province: string;
}


export class User{
    id: string;
    user_id: string;
    user_name: string;
    address: Address;
    additional_address: string;
    company_name: string;
    country_code: string;
    dob: Date;
    email: string;
    first_name:string;
    last_name: string;
    gender: string;
    legal_doc: Array<FileDetails>
    mobile_no: string;
    registration_date: Date;
    ruc_doc: Array<FileDetails> = [];
    status: string;
    user_type: Array<string>;
    vehicle_types: Array<string> = [];
    vehicle_condition: Array<string> = [];
    profile_pic: FileDetails;
}

export class FileDetails{
    key: string;
    download_url: string;
}
