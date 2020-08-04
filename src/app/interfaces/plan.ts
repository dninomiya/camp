export interface Plan {
  id: string;
  subTitle: string;
  title: string;
  price: string;
  points: string[];
}

export type PlanID = 'free' | 'lite' | 'solo' | 'mentor' | 'isa' | 'admin';
