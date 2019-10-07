import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const createPlan = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error('ユーザーが存在しません');
  }

  const connectData: any = (await db.doc(`users/${context.auth.uid}/private/connect`).get()).data();

  if (!connectData || !connectData.stripeUserId) {
    throw new Error('ストライプアカウントが存在しません');
  }

  const result = await stripe.plans.create(
    {
      amount: data.amount,
      interval: 'month',
      nickname: data.nickname,
      product: connectData.productId,
      currency: 'jpy',
    },
    {
      stripe_account: connectData.stripeUserId
    }
  );

  return db.doc(`channels/${context.auth.uid}/plans/${result.id}`).set({
    ...data,
    id: result.id,
    memberCount: 0
  });
});
