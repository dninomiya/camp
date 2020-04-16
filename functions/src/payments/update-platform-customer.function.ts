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

export const updatePlatformCustomer = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    console.log(data);
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '権限がありません'
      );
    }

    if (!data.card) {
      throw new functions.https.HttpsError(
        'data-loss',
        'カード情報がありません'
      );
    }

    try {
      await stripe.customers.update(data.customerId, {
        source: data.source,
        description: data.description,
      });
    } catch (error) {
      console.error(error);
      throw new HttpsError('invalid-argument', '不正な値でした');
    }

    return setCard(context.auth.uid, data.card);
  });
