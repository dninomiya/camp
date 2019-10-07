import * as functions from 'firebase-functions';
import { db, countUp } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

const createChannelCustomer = async (data: {
  customerId: string;
  stripeAccount: string;
  userId: string;
  channelId: string;
}) => {
  const token = await stripe.tokens.create({
    customer: data.customerId,
  }, {
    stripe_account: data.stripeAccount
  });

  const user = (await db.doc(`users/${data.userId}`).get()).data();

  if (!user) {
    throw new Error('ユーザーが存在しません');
  }

  const customer = await stripe.customers.create({
    description: 'Updateカスタマー',
    email: user.email,
    name: user.name,
    source: token.id
  }, {
    stripe_account: data.stripeAccount,
  })

  await db.doc(`channels/${data.channelId}/customers/${data.userId}`).set({
    customerId: customer.id,
    userId: data.userId
  });

  return {
    id: customer.id
  };
}

export const subscribePlan = functions.https.onCall(async (data: {
  customerId: string,
  planId: string,
  channelId: string
}, context) => {

  if (!context.auth) {
    throw new Error('認証エラー');
  }

  const userId = context.auth.uid;

  const connect: any = (await db.doc(`users/${data.channelId}/private/connect`).get()).data();

  let customer = (await db.doc(`channels/${data.channelId}/customers/${userId}`).get()).data();

  if (!customer) {
    customer = await createChannelCustomer({
      customerId: data.customerId,
      stripeAccount: connect.stripeUserId,
      userId,
      channelId: data.channelId
    });
  }

  const subscription = await stripe.subscriptions.create(
    {
      customer: customer.id,
      default_tax_rates: [connect.taxId],
      items: [{ plan: data.planId }],
      application_fee_percent: 15,
      expand: ['latest_invoice.payment_intent'],
    },
    {
      stripe_account: connect.stripeUserId,
    }
  );

  await db.doc(`channels/${data.channelId}/plans/${data.planId}/members/${userId}`).set({
    userId,
    customerId: customer.id,
    planId: data.planId,
    subscriptionId: subscription.id,
    startedAt: new Date(),
    noteCount: 0,
    channelId: data.channelId
  });

  await countUp(`channels/${data.channelId}/plans/${data.planId}`, 'memberCount');

  return db.doc(`users/${userId}/subscriptions/${data.planId}`).set({
    planId: data.planId,
    subscriptionId: subscription.id,
    startedAt: new Date(),
    clientStripeUserId: connect.stripeUserId
  });
});
