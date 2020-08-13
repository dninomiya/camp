export interface Plan {
  id: string;
  subTitle: string;
  title: string;
  points: string[];
}

export type PlanID =
  | 'free'
  | 'lite'
  | 'solo'
  | 'mentor'
  | 'mentorLite'
  | 'isa'
  | 'admin';

export interface PlanData {
  id: PlanID;
  name: string;
  features: string[];
  mainPriceId: string;
  productId: string;
}

export interface PlanModel {
  plans: PlanData[];
  order: string[];
  coupon: string[];
}

export interface PlanOrder {
  order: string[];
}
