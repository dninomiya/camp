export type jobStyle = 'remote' | 'office' | 'both';

export interface Job {
  userId: string;
  title: string;
  description: string;
  amount: number;
  style: jobStyle;
  public: boolean;
}

export interface Jobs {
  items: Job[];
}
