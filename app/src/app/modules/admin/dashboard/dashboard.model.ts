export class UserStatsNumbers {
  active: number;
  inactive: number;
}

export class UserStats {
  buyer: UserStatsNumbers;
  seller: UserStatsNumbers;
  dealer: UserStatsNumbers;
}

export class UserStatsAPIResponse{
  message: string;
  success_code: string;
  data: UserStats
}

export class OrderStats{
  cancelled: number;
  delivered: number;
  in_price_negotiation: number;
  in_review: number;
  in_vehicle_procedure: number;
  out_for_delivery: number;
  total_orders: number;
}

export class OrderEarning{
  via_card?: number;
  via_cash?: number;
  via_bank?: number;
}

export class OrderStatsAPIResponse{
  message: string;
  success_code: string;
  data: OrderStats;
}

export class ExpertReviewEarning{
  via_card?: number;
  via_cash?: number;
  via_bank?: number;
}

export class Earning{
  date?:string;
  order?: OrderEarning;
  expert_review?: ExpertReviewEarning;
  total: number;
}

export class EarningStatsAPIResponse {
  success_code: string;
  message: string;
  data: Array<Earning>;
}

export class VehicleStatsAPIResponse {
  message: string;
  success_code: string;
  data: {
    dates: Array<{
      date: string;
      vehicle_listed: number;
      vehicle_sold: number;
    }>;
    vehicle_type_counts: Array<{
      type: string;
      total_order_vehicles: number;
      total_vehicles: number;
    }>
  }
}

export enum Filters{
  Today = 'Today',
  Yesterday = 'Yesterday',
  Last7Days = 'Last 7 Days',
  Last30Days = 'Last 30 Days',
  ThisMonth = 'This Month',
  LastMonth = 'Last Month',
  CustomRange = 'Custom Range'
}
