import * as functions from 'firebase-functions';
import { db } from '../utils';
import { HttpsError } from 'firebase-functions/lib/providers/https';
const stripe = require('stripe')(functions.config().stripe.key);

const setCard = (uid: string, card: any) => {
  const { address_zip, exp_month, exp_year, last4, brand, id } = card;
  return db.doc(`users/${uid}/private/payment`).set(
    {
      card: { address_zip, exp_month, exp_year, last4, brand, id },
    },
    { merge: true }
  );
};

export const createPlatformCustomer = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        source: string;
        email: string;
        description: string;
        card: any;
      },
      context
    ) => {
      console.log(data);

      if (!context.auth) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '権限がありません'
        );
      }

      try {
        const coupon = await stripe.coupons.retrieve(
          functions.config().stripe.coupon
        );
        const customer = await stripe.customers.create({
          source: data.source,
          email: data.email,
          description: data.description,
          coupon: coupon && coupon.valid ? coupon.id : null,
        });

        await db.doc(`users/${context.auth.uid}/private/payment`).set(
          {
            customerId: customer.id,
          },
          { merge: true }
        );
      } catch (error) {
        console.error(error);
        throw new HttpsError('invalid-argument', '不正な値でした');
      }
      return setCard(context.auth.uid, data.card);
    }
  );
