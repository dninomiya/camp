import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const unsubscribePlan = functions.https.onCall(
  async (
    data: {
      userId: string;
      planId: string;
      reason?: object;
    },
    context
  ) => {
    if (!context.auth) {
      throw new Error('認証エラー');
    }
    const userPayment = (
      await db.doc(`users/${data.userId}/private/payment`).get()
    ).data();

    if (!userPayment) {
      return;
    }

    await stripe.subscriptions.update(userPayment.subscriptionId, {
      cancel_at_period_end: true
    });
  }
);
