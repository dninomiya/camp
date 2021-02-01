export interface StripePrice {
  id: string;
  active: boolean;
  billing_scheme: string;
  tiers_mode: string;
  tiers: string;
  currency: string;
  description: string;
  type: string;
  unit_amount: string;
  recurring: string;
  interval: string;
  interval_count: string;
  trial_period_days: number;
  transform_quantity: string;
  [meta: string]: string | number | boolean;
}
