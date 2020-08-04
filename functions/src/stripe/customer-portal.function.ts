import { stripe } from './client';
import * as functions from 'firebase-functions';
import { db } from '../db';

export const getStripeCustomerPortalURL = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    const customer: any = (
      await db.doc(`customers/${context.auth.uid}`).get()
    ).data();

    try {
      const result = await stripe.billingPortal.sessions.create({
        customer: customer.customerId,
      });

      return result.url;
    } catch (error) {
      console.error(error);
      throw new functions.https.HttpsError('unknown', error);
    }
  });
