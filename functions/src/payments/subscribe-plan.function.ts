import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const subscribePlan = functions.https.onCall(
  async (
    data: {
      customerId: string;
      planId: string;
      channelId: string;
      subscriptionId?: string;
    },
    context
  ) => {
    if (!context.auth) {
      throw new Error('認証エラー');
    }

    const userId = context.auth.uid;
    const planId = functions.config().plan[data.planId];
    let subscription;

    if (data.subscriptionId) {
      subscription = await stripe.subscriptions.update(data.subscriptionId, {
        plan: planId
      });
    } else {
      subscription = await stripe.subscriptions.create({
        customer: data.customerId,
        default_tax_rates: [functions.config().stripe.tax],
        trial_period_days: 7,
        items: [{ plan: planId }]
      });
    }

    await db.doc(`users/${userId}`).update({
      plan: data.planId,
      trialUsed: true
    });

    await db.doc(`users/${userId}/private/payment/`).update({
      planId: data.planId,
      subscriptionId: subscription.id,
      startedAt: new Date()
    });
  }
);
