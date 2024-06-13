
export class Location {
  address?: string;
  parish?: string;
  city?: string;
  province?: string;
}

export class ScheduleMeeting {
  is_meeting_scheduled: boolean;
  current_stage: string;
  order_id: string;
  date: string;
  time: string;
  location: Location = new Location();
  additional_address: string;
  is_accepted: boolean;
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
  cover_image: string;
  body_type: string;
  number_plate: string;
  make: string;
  model: string;
  year: number;
  location: Location;
  condition: string;
  fuel_type: string;
  distance_travelled: number;
  price: number;
  primary_image: string;
  other_images: [{
    key: string;
    url: string;
  }];
  distance_travelled_unit: string;
}

export class Order {
  id: string;
  status: string;
  created_at: Date;
  vehicle: Vehicle;
  total_amount: number;
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


export class OrderDetails {
  bank_receipt: BankReceipt;
  order_id: string;
  vehicle_id: string;
  order_date: string;
  order_status: string;
  original_price: number;
  delivery_status: string;
  current_stage: string;
  negotiation_details: Negotiation;
  payment: Payment;
  total_price: number;
  vehicle_procedure: VehicleProcedure;
  seller: SellerInformation;
  expert_evaluation: ExpertReview;
  meetings: ScheduleMeeting[];
  vehicle_review: VehicleReview;
  vehicle: Vehicle;
  loan: any;
}
export class Payment {
  amount: any;
  status: string;
  type: string;
}

export class ExpertReview{
  is_expert_evaluation: boolean;
  appraisal_comment: string;
  appraisal_status: string;
  expert: any;
  package:any;
  location:any;
  id: string;
}

export class VehicleProcedure {
  current_step: string;
  id: string;
  is_vehicle_procedure: boolean;
  status: string;
}

export class BankReceipt {
  bank_receipt_url: string;
  is_bank_receipt: string;
}



export class OrderResponse {
  message: string;
  success_code: string;
  data: Order;
}


export class Pagination {
  total_pages: number;
  current_page: number;
  items_per_page: number;
}

export class OrderListResponse {
  data: {
    items: Array<Order>;
    pagination: Pagination;
  };
  message: string;
  success_code: string
}
