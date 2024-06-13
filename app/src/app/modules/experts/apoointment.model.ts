export class ScheduleAppointment {
  expert_review_id: string;
  date: any;
  time: string;
  address: Location = new Location();
  additional_address: string;
  lat: any;
  lng: any;
}

export class Location {
  address?: string;
  parish?: string;
  city?: string;
  province?: string;
}

export class AppointmentList {
  id: string;
  meetings_count: number;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  mobile_no: string;
  location: Location;
  vehicle_name: string;
  is_insider: boolean;
  package_name: string;
  appraisal_status: string;
}


export class AppointmentDetails {
  id: string;
  order_id?: string;
  expert_review_id: string;
  current_step: string;
  package_details: PackageDetails;
  payment: Payment;
  vehicle_information: VehicleInformation;
  contact_info: ContactInformation;
  expert_information: ExpertInformation;
  appraisal_report_status: string;
  meetings: Array<Meetings>
  appraisal_report: AppraisalReport;
}

export class AppraisalReport {
  id: string;
  additional_criteria: string;
}

export class Meetings {
  id: string;
  date: string;
  time: string;
  location: Address;
}

export class ExpertInformation {
  id:string;
  first_name: string;
  last_name: string;
  expert_code: string;
  location: Address;
}

export class ContactInformation {
  full_name: string;
  cadula_id: string;
  email: string;
  mobile_no: string;
  country_code: string;
  location: Address;
}

export class Address {
  address: string;
  city: string;
  parish: string;
  province: string;
  additional_address?: string;
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
}


export class Payment {
  amount: number;
  method: string;
  status: string;
}
export class PackageDetails {
  package_name: string;
  package_price: string;
  package_services: string;
  is_recommended: string;
  id: string;
}