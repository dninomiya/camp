export interface StripeProduct {
  active: boolean;
  name: string;
  description: string;
  role: string;
  images: string[];
  [meta: string]: string | string[] | number | boolean;
}
