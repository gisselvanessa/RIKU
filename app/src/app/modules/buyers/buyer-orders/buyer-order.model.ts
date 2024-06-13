
export class MeetingLocation {
  address?: string;
  parish?: string;
  city?: string;
  province?: string;
}

export class ScheduleMeeting {
  is_meeting_scheduled: boolean;
  is_accepted: boolean | null;
  current_stage: string;
  order_id: string;
  date: string;
  time: string;
  location: MeetingLocation = new MeetingLocation();
  additional_address: string;
}

export class BankReceipt {
  bank_receipt_url: string;
  is_bank_receipt: string;
}

export class Negotiation {
  actual_price: number;
  negotiated_price: number;
  is_price_negotiating?: boolean;
  is_offer_accepted?: boolean;
}

export class VehicleReview {
  vehicle_review_status: string;
  vehicle_review_comment: string;
}

export class Vehicle {
  id: string;
  primary_image: string;
  make: string;
  model: string;
  year: number;
  body_type: string;
  licence_number: string;
  number_plate: string;
  location: MeetingLocation;
  condition: string;
  fuel_type: string;
  distance_travelled: number;
  price: number;
  other_images: [{
    key: string;
    url: string;
  }];
  distance_travelled_unit: string;
  is_price_negotiable: boolean;
}

export class VehicleProcedure {
  current_step: string;
  id: string;
  is_vehicle_procedure: boolean;
  status: string;
}

export class Order {
  bank_receipt: BankReceipt;
  order_id: string;
  vehicle_id: string;
  order_date: string;
  order_status: string;
  original_price: number;
  delivery_status: string;
  current_stage: string;
  negotiation_details: Negotiation;
  payment: any;
  total_price: number;
  vehicle_procedure: VehicleProcedure;
  seller: SellerInformation;
  meetings: ScheduleMeeting[];
  vehicle_review: VehicleReview;
  vehicle: Vehicle;
  expert_evaluation: ExpertEvaluation;
  loan?: any;
}

export class ExpertEvaluation {
  id: string | null;
  appraisal_status: string;
  is_expert_evaluation: boolean;
  appraisal_comment: string;
  expert: Expert;
  location: MeetingLocation;
  package: Package;
}

export class Package {
  name: string;
  price: any;
}

export class Expert {
  first_name: string;
  last_name: string;
}

export class SellerInformation {
  ratingInStar: string;
  username: string;
  additional_address: string;
  location: SellerLocation;
  totalRatings: string;
  type: Array<string>;
}
export class SellerLocation {
  province: string;
  city: string;
  parish: string;
  address: string;
}

export class AddOrderResponse {
  message: string;
  success_code: string;
  data: any;
}


export class GetOrderResponse {
  message: string;
  success_code: string;
  data: Order;
}
