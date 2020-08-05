export interface PaymentCard {
  address_zip: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  brand: string;
  id: string;
}

export interface Customer {
  card: PaymentCard;
  customerId: string;
  subscriptionId?: string;
  paymentMethod: string;
}
