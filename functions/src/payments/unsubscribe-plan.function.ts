import * as functions from 'firebase-functions';
import { db, countDown } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const unsubscribePlan = functions.https.onCall(async (data: {
  userId: string;
  planId: string;
  channelId: string;
  reason?: object;
}, context) => {
  if (!context.auth) {
    throw new Error('認証エラー');
  }

  const memberPath = `channels/${data.channelId}/plans/${data.planId}/members/${data.userId}`;
  const member = (await db.doc(memberPath).get()).data();

  await db.doc(memberPath).delete();
  await db.doc(`users/${data.userId}/subscriptions/${data.planId}`).delete();
  await countDown(`channels/${data.channelId}/plans/${data.planId}`, 'memberCount');

  if (context.auth.uid !== data.userId) {
    await db.collection(`forcedWithdrawals`).add({
      date: new Date(),
      ...data,
    });
  } else {
    await db.collection(`channels/${data.channelId}/plans/${data.planId}/withdrawals`).add({
      date: new Date(),
      ...data,
    });
  }

  const connect = (await db.doc(`users/${data.planId}/private/connect`).get()).data();

  if (member && connect) {
    return stripe.subscriptions.del(
      member.subscriptionId,
      {
        stripe_account: connect.stripeUserId
      }
    );
  } else {
    throw new Error('メンバーが存在しません');
  }
});
