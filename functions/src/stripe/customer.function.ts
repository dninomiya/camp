import { StripeService } from './service';
import { db } from './../utils/db';
import Stripe from 'stripe';
import * as functions from 'firebase-functions';

export const getStripeCustomer = functions
  .region('asia-northeast1')
  .https.onCall(
    async (_, context): Promise<Stripe.Customer | null> => {
      if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      return StripeService.getStripeCustomer(context.auth.uid);
    }
  );
