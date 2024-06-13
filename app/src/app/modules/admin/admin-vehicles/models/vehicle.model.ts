export class Location {
  city: string = ''
  province: string = ''
  parish: string = ''
}

export class Brand {
  id?: number
  uuid?: string
  name?: string
  vehicle_type_id?: number
  icon_asset_id?: number
  is_popular?: boolean
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export class BrandModel {
  id?: number
  uuid?: string
  vehicle_brand_id?: number
  model?: string
  year?: number
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export class PrimaryPhoto {
  id?: number
  uuid?: string
  type?: string
  url?: string
  is_active?: boolean
  created_at?: boolean
  updated_at?: boolean
}

export class VehicleDetail {
  vehicle_id?: number
  body_type_id?: number
  year?: number
  description?: string
  condition?: any
  color?: string
  licence_number?: string
  number_plate?: string
  is_negotiable?: boolean
  registration_year?: number
  // mileage?: number
  // mileage_unit?: string
  passanger_capacity?: number
  passanger_doors?: number
  transmission?: string
  break_type?: string
  glass_type?: string
  // body_work?: string
  engine_size?: number
  tonage_capacity?: string
  comforts: Array<string> = []
  technologies: Array<string> = []
  securities: Array<string> = []
  entertainments: Array<string> = []
  utilities: Array<string> = []
  other_img_asset_ids: Array<string> = []
  doc_type?: string
  doc_number?: string
}


export class VehicleType {
  id?: number
  uuid?: string
  type?: any
  is_active?: boolean
  created_at?: Date
  updated_at?: Date
}

export class Vehicle {
  id?: any;
  uuid?: string;
  user_id?: number
  type_id?: number
  model_id?: number
  vehicle_brand_id?: number
  fuel_type?: string
  distance_travelled?: number
  distance_travelled_unit?: string
  cover_img_asset_id?: number
  location?: Location
  price?: number
  status?: string
  is_verifed?: boolean
  is_active?: boolean
  published_at?: Date
  created_at?: Date
  updated_at?: Date
  vehicle_details?: VehicleDetail
  primary_photo?: PrimaryPhoto
  cover_img?: PrimaryPhoto
  vehicle_type?: VehicleType
  brand?: Brand
  brand_model?: BrandModel;
  start_date: Date;
  end_date: Date;
}

export class PaginationData {
  total_pages: number = 0
  current_page: number = 1
  items_per_page: number = 0;
}

export class VehicleListResponse{
  message: string;
  success_code: string;
  data: {
    items: Vehicle;
    pagination: PaginationData
  }
}
