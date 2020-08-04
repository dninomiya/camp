export interface Plan {
  id: string;
  subTitle: string;
  title: string;
  amount: number;
  points: string[];
}

export type PlanID = 'free' | 'lite' | 'solo' | 'mentor' | 'isa' | 'admin';
