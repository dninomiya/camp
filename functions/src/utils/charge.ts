import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const charge = async (data: {
  amount: number;
  userId: string;
  channelId: string;
  contentId: string;
  type: string;
  sellerEmail: string;
  contentPath: string;
  title: string;
}) => {

  const seller: any = (await db.doc(`users/${data.channelId}/private/connect`).get()).data();
  const userPayment: any = (await db.doc(`users/${data.userId}/private/payment`).get()).data();

  await stripe.charges.create({
    amount: data.amount,
    currency: 'jpy',
    customer: userPayment.customerId,
    application_fee_amount: data.amount * 0.15,
    transfer_data: {
      destination: seller.stripeUserId,
    }
  });

  return db.doc(`users/${userPayment.customerUserId}/settlements/${data.contentId}`).set({
    ...data,
    createdAt: new Date()
  });
}
