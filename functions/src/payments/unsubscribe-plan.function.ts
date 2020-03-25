import { sendEmail } from './../utils/sendgrid';
import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

const PLAN_LABELS = {
  lite: 'ライト',
  solo: 'ソロ',
  mentor: 'メンター'
};

export const unsubscribePlan = functions.region('asia-northeast1').https.onCall(
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

    const user = (await db.doc(`users/${data.userId}`).get()).data() as any;
    const plan = user.plan as 'lite' | 'solo' | 'mentor';

    await sendEmail({
      to: 'daichi.ninomiya@deer.co.jp',
      templateId: 'unRegisterToAdmin',
      dynamicTemplateData: {
        email: user.email,
        name: user.name,
        plan: PLAN_LABELS[plan]
      }
    });

    await stripe.subscriptions.update(userPayment.subscriptionId, {
      cancel_at_period_end: true
    });

    return db.doc(`users/${data.userId}`).update({
      isCaneclSubscription: true
    });
  }
);
