import { PlanID } from './plan';
import { firestore } from 'firebase/app';
export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarURL: string;
  readonly createdAt: firestore.Timestamp;
  readonly isCustomer: boolean;
  readonly isSeller: boolean;
  readonly mentor: boolean;
  readonly admin: boolean;
  readonly plan: PlanID;
  readonly endAt: firestore.Timestamp;
  readonly payLimitDate?: firestore.Timestamp;
  readonly trialUsed: boolean;
  readonly currentPeriodStart?: number;
  readonly currentPeriodEnd?: number;
  readonly isCaneclSubscription?: boolean;
  readonly isa?: {
    start: number;
    end: number;
  };

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
  subscriptionId?: string;
}

export interface UserConnect {
  taxId?: string;
  stripeUserId?: string;
  productId?: string;
}
