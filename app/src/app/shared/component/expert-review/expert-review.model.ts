import { Location } from "../../models/user-profile.model";

export class Package {
  created_at: Date;
  details: Array<string> = [];
  id: string;
  is_recommended: boolean;
  name: string;
  price: number | string;
  updated_at: Date;
  uuid: string;
}


export class ExpertListResponse {
  message: string;
  data: Array<Package>;
  success_code: string;
}

export class ExpertList {
  id: string;
  name: string;
  location: Location;
}

export class SummaryDetails {
  id: string;
  order_id?:string;
  expert_review_id: string;
  current_step: string;
  package_details: PackageDetails;
  payment: Payment;
  vehicle_information: VehicleInformation;
  contact_info: ContactInformation;
  expert_information: ExpertInformation;
}

export class ExpertReviewDetails {
  id: string;
  expert_review_id: string;
  current_step: string;
  package_details: PackageDetails;
  payment: Payment;
  vehicle_information: VehicleInformation;
  contact_info: ContactInformation;
  expert_information: ExpertInformation;
}

export class Payment {
  amount: number;
  method: string;
  status: string;
}

export class ExpertInformation {
  first_name: string;
  last_name: string;
  location: Address;
}

export class ContactInformation {
  first_name: string;
  last_name: string;
  cadula_id: string;
  email: string;
  mobile_no: string;
  country_code: string;
  address: Address;
full_name: any;
location: any;
}

export class Address {
  address: string;
  city: string;
  parish: string;
  province: string;
}

export class VehicleInformation {
  id: string;
  make: string;
  model: string;
  year: any;
  body_type: string;
  number_plate: string;
  price: any;
  is_insider: boolean;
  images: Array<string>;
  class:string;
  services: Array<string>;
  color: string;
}

export class PackageDetails {
  package_name: string;
  package_price: string;
  package_services: string;
  is_recommended: string;
  id: string;
}

export class SelectPackageResponse {
  message: string;
  data: any;
  success_code: string;
}

