export type jobStyle = 'remote' | 'office';
export type jobPosition = 'CTO' | 'UIデザイン';

export interface JobCard {
  userId: string;
  amount: number;
  office: boolean;
  remote: boolean;
  employee: boolean;
  mentor: boolean;
  ui: boolean;
  pm: boolean;
  manage: boolean;
  front: boolean;
  ai: boolean;
  infra: boolean;
  server: boolean;
  native: boolean;
  fullstack: boolean;
  ar: boolean;
  desing: boolean;
  vr: boolean;
  startup: boolean;
  cto: boolean;
  skills: string;
  target: string;
  pr: string;
  public: boolean;
}

