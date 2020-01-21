import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);
const planId = functions.config().stripe.plan;
const taxId = functions.config().stripe.tax;

export const createSubscription = functions.https.onCall(async (data: {
  customerId: string,
}, context) => {

  if (!context.auth) {
    throw new Error('認証エラー');
  }

  const userId = context.auth.uid;

  const subscription = await stripe.subscriptions.create(
    {
      customer: data.customerId,
      default_tax_rates: [taxId],
      items: [{ plan: planId }],
      trial_period_days: 7,
      expand: ['latest_invoice.payment_intent'],
    }
  );

  await db.doc(`users/${userId}`).update({
    plan: 'standard'
  });

  return db.doc(`users/${userId}/subscriptions/${planId}`).set({
    planId,
    subscriptionId: subscription.id,
    startedAt: new Date(),
  });
});
