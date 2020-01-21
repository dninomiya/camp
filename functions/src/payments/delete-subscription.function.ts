import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);
const planId = functions.config().stripe.plan;

export const deleteSubscription = functions.https.onCall(async (data: {
  customerId: string,
}, context) => {

  if (!context.auth) {
    throw new Error('認証エラー');
  }

  const userId = context.auth.uid;

  await db.doc(`users/${userId}`).update({
    plan: 'free'
  });

  const subscription = (await db.doc(`users/${userId}/subscriptions/${planId}`).get()).data();

  await db.doc(`users/${userId}/subscriptions/${planId}`).delete();

  if (subscription) {
    await stripe.subscriptions.del(subscription.subscriptionId);
  }
});
