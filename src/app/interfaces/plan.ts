export interface Plan {
  id?: string;
  amount: number;
  description: string;
  per: PlanPer;
  type: PlanType;
  memberCount?: number;
  active: boolean;
}

export type PlanPer = 'time' | 'coaching' | 'month';
export type PlanType = 'question' | 'review' | 'coaching' | 'trouble' | 'premium' | 'cause' | 'lesson';
