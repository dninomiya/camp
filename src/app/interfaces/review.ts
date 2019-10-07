import { PlanType } from './plan';

export interface Review {
  authorId: string;
  body: string;
  rate: number;
  createdAt: Date;
  type: PlanType;
}
