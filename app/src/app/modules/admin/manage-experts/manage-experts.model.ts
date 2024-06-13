export class ExpertUserDetails {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  mobile_no: string;
  country_code: string;
  address: Address;
  expert_code: string;
  code_num_system: string;
  profile_img_url: string;
  documents: any;
  created_at: string;
  is_active: boolean;
  expert_code_num_sys?: string;
  location?: string;
  image?: string;
}

export class Address {
  province: string;
  city: string;
  parish: string;
  lat?: string;
  lng?: string;
  additional_address?: string;
}


export class GetExpertResponse{
  message: string;
  success_code: string;
  data: ExpertUserDetails;
}

export class PaginationData {
  total_pages: number = 0
  current_page: number = 1
  items_per_page: number = 0;
}


export class GetExpertListResponse{
  message: string;
  success_code: string;
  data: {
    items: Array<ExpertUserDetails>,
    pagination: PaginationData
  }
}
