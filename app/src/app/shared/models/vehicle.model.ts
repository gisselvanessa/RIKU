export class VehicleDetail {
  id: string;
  is_approved: boolean;
  location: Location;
  fuel_type: string;
  price: number;
  distance_travelled: number;
  favorite_vehicle_count:number;
  distance_travelled_unit: string;
  created_at: Date;
  make: string;
  make_model: string;
  model_year: number;
  cover_img_url: any;
  other_img_urls: Array<any>;
  description: string;
  vehicle_type: string;
  registration_year: number;
  licence_number: string;
  number_plate: string;
  is_in_session: boolean;
  is_negotiable: boolean;
  // mileage: number;
  // mileage_unit: string;
  transmission: string;
  body_type: string;
  color: string;
  passanger_capacity: number;
  passanger_doors: number;
  break_type: string;
  glass_type: string;
  // body_work: string;
  engine_size: number;
  tonage_capacity: string;
  comforts: Array<string>;
  technologies: Array<string>;
  securities: Array<string>;
  entertainments: Array<string>;
  is_draft: boolean;
  utilities: Array<string>;
  condition:string;
  status: string;
  primary_photo: any;
  rejection_reason:string;
  quantity: number;
  seller: any;
  is_active:boolean;
  trade_process:string;

  constructor() {
    this.location = this.location || new Location();
  }
}

export class Location {
  city: string = '';
  province: string = '';
}
