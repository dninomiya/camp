export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarURL: string;
  readonly createdAt: Date;
  readonly isCustomer: boolean;
  readonly isSeller: boolean;
  readonly mentor: boolean;
  readonly admin: boolean;

  mailSettings: {
    forum: boolean;
    premium: boolean;
  };
}

export interface PaymentCard {
  address_zip: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  brand: string;
  id: string;
}

export interface UserPayment {
  card: PaymentCard;
  customerId: string;
}

export interface UserConnect {
  taxId?: string;
  stripeUserId?: string;
  productId?: string;
}
