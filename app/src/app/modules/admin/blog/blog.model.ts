import { PaginationData } from "src/app/shared/models/pagination.model";

export class Blog {
  id: string;
  created_at?: Date;
  title?: string;
  html?:string;
  tags:Array<string>;
  cover_asset_url?:any;
  uuid?:string;
  asset_type:string;
  is_published:boolean;
}

export class BlogListResponse{
  message: string;
  success_code: string;
  data: {
    items: Array<Blog>,
    pagination: PaginationData
  }
}

export class BlogDetailResponse{
  message: string;
  success_code: string;
  data: Blog;
}
