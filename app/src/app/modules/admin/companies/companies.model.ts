export class CompanyList{
    data:{
      items: Array<Company>;
      pagination: Pagination;
    };
    message: string;
    success_code: string
}

export class Company{
    id: string;
    company_name: string;
    created_by: string;
    created_date: string;
}

export class Pagination{
    total_pages: number;
    current_page: number;
    items_per_page: number;
}

export class NewCompany{
    company_name: string;
}

export class CompanyAdded{
    data:{
        company_id: string;
        company_name: string;
    };
    message: string;
    success_code: string
}

export class CompanyDeleted{
    data:{};
    message: string;
    success_code: string
}