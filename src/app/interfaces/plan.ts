import { PriceWithProduct } from './price';

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

export interface PlanDataWithPrice extends PlanData {
  price: PriceWithProduct;
}
