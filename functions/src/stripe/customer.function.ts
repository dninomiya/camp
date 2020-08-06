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

export const deleteStripeCustomer = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    const customer = (
      await db.doc(`customers/${context.auth.uid}`).get()
    ).data();

    if (!customer) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'there is no customer'
      );
    }

    try {
      await StripeService.client.customers.del(customer.customerId);
    } catch (error) {
      throw new functions.https.HttpsError('internal', error.code);
    }

    return db.doc(`customers/${context.auth?.uid}`).delete();
  });
