import { BankReceipt, Order } from '../../buyers/buyer-orders/buyer-order.model';

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
  cover_img: string;
  make: string;
  model: string;
  year: number;
  location: Location;
  condition: string;
  fuel_type: string;
  distance_travelled: number;
  price: number;
  other_images: [{
    key: string;
    url: string;
  }];
  distance_travelled_unit: string;
}

export class OrderDetail {
  id: string;
  status: string;
  created_at: Date;
  vehicle: Vehicle;
  total_amount: number;
  is_paid: boolean;
  payment_status: string;
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

export class OrderResponse {
  message: string;
  success_code: string;
  data: Order;
}


export class Pagination{
  total_pages: number;
  current_page: number;
  items_per_page: number;
}

export class OrderListResponse {
  data:{
    items: Array<OrderDetail>;
    pagination: Pagination;
  };
  message: string;
  success_code: string
}
