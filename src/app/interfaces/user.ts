import { PlanID } from './plan';
import { firestore } from 'firebase/app';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarURL: string;
  readonly profile?: string;
  readonly createdAt: firestore.Timestamp;
  readonly admin: boolean;
  readonly plan: PlanID;
  readonly trialUsed: boolean;
  readonly currentPeriodStart?: firestore.Timestamp;
  readonly currentPeriodEnd?: firestore.Timestamp;
  readonly isCaneclSubscription?: boolean;
  readonly isTrial?: boolean;
  readonly tasks?: string[];
  readonly repoId?: string;
  readonly point?: number;
  readonly links?: string[];
  readonly lastPullRequestDate?: firestore.Timestamp;
  readonly isa?: {
    start: firestore.Timestamp;
    end?: firestore.Timestamp;
  };
  complete?: string[];

  mailSettings: {
    forum: boolean;
    premium: boolean;
  };
}

export interface UserConnect {
  taxId?: string;
  stripeUserId?: string;
  productId?: string;
}
