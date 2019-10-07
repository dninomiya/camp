import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const planMemberDelete = functions.firestore
  .document('channels/{channelId}/plans/{planId}/members/{userId}')
  .onDelete(async (snapshot, context) => {
    const subscription = snapshot.data();

    if (subscription) {
      await stripe.subscriptions.del(subscription.subscriptionId, {
        stripe_account: subscription.clientStripeUserId,
      });

      return db.doc(
        `users/${context.params.userId}/subscriptions/${context.params.planId}`
      ).delete();
    } else {
      throw new Error('subscription is not defined');
    }
  });
