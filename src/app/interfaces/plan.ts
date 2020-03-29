export interface Plan {
  id: string;
  subTitle: string;
  title: string;
  amount: number;
  points: string[];
}

export type PlanID = 'free' | 'lite' | 'solo' | 'mentor' | 'isa';

export type PlanPer = 'time' | 'coaching' | 'month';
export type PlanType = 'question' | 'review' | 'coaching' | 'trouble' | 'premium' | 'cause' | 'lesson';
