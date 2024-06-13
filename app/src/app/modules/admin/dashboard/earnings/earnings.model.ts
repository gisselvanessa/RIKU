export class OrderEarning{
  via_card?: number;
  via_cash?: number;
  via_bank?: number;
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

export class EarningResponse {
  success_code: string;
  message: string;
  data: Array<Earning>
}
