import * as functions from 'firebase-functions';
import { db } from '../utils';
const stripe = require('stripe')(functions.config().stripe.key);

export const createPlatformCustomer = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        source: string;
        email: string;
        description: string;
      },
      context
    ) => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '権限がありません'
        );
      }

      const coupon = await stripe.coupons.retrieve(
        functions.config().stripe.coupon
      );
      const customer = await stripe.customers.create({
        ...data,
        coupon: coupon && coupon.valid ? coupon.id : null
      });

      await db.doc(`users/${context.auth.uid}`).update({
        isCustomer: true
      });

      return db.doc(`users/${context.auth.uid}/private/payment`).set(
        {
          customerId: customer.id
        },
        { merge: true }
      );
    }
  );
