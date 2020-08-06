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
