import * as functions from 'firebase-functions';
import { db, sendEmail } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const chargePlan = functions.https.onCall(async (data: {
  amount: number;
  userId: string;
  channelId: string;
  contentId: string;
  type: string;
  sellerEmail: string;
  contentPath: string;
  title: string;
}, context) => {

  if (!context.auth) {
    throw new Error('認証エラー');
  }

  const connectData: any = (await db.doc(`users/${data.channelId}/private/connect`).get()).data();
  const userPayment: any = (await db.doc(`users/${data.userId}/private/payment`).get()).data();

  await sendEmail({
    to: data.sellerEmail,
    templateId: 'charged',
    dynamicTemplateData: {
      path: data.contentPath,
      title: data.title
    }
  });

  await stripe.charges.create({
    amount: data.amount,
    currency: 'jpy',
    customer: userPayment.customerId,
    application_fee_amount: data.amount * 0.15,
    transfer_data: {
      destination: connectData.stripeUserId,
    }
  });

  return db.doc(`users/${data.userId}/settlements/${data.contentId}`).set({
    ...data,
    createdAt: new Date()
  });
});
