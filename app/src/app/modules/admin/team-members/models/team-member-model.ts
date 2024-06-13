export class TeamMemberDetails {
    created_at: Date;
    email: string;
    first_name: string;
    last_name: string;
    mobile_no: number;
    status: string;
    user_id: string;
    country_code: string;
    company_role: [{
        company: {
            company_id: string;
            company_name: string;
        };
        company_role_id: string;
        company_role_name: string;
        user_company_role_id: string;
    }]
}