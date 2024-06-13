export class ContactUsListing {
    id: string;
    date: any;
    first_name: string;
    last_name: string;
    email: string;
    mobile_no: string;
    subject: string;
    status: string;
}

export class ContactUsDetails {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_no: string;
    subject: string;
    status: string;
    country_code: string;
    message: string;
    response_subject?: string;
    closing_message?: string;
    created_at: any;
    closed_by?: ClosedBy;

}

export class ClosedBy {
    id:string;
    first_name:string;
    last_name:string;
    user_name:string;
    profile_img:string;
    current_role:string;
    date:any;
}