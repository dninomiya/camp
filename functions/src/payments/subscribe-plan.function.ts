import { sendEmail } from './../utils/sendgrid';
import * as functions from 'firebase-functions';
import { db } from '../utils';
import moment = require('moment');

const stripe = require('stripe')(functions.config().stripe.key);

const PLAN_LABELS = {
  lite: 'ライト',
  solo: 'ソロ',
  mentor: 'メンター'
};

export const subscribePlan = functions.region('asia-northeast1').https.onCall(
  async (
    data: {
      customerId: string;
      planId: 'lite' | 'solo' | 'mentor';
      subscriptionId?: string;
      trialUsed: boolean;
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
      console.log('プラン変更: ' + data.subscriptionId);
      subscription = await stripe.subscriptions.update(data.subscriptionId, {
        plan: planId
      });
    } else {
      const ukey = moment().format('YYYY-MM-DD-HH') + '-' + userId;
      console.log(ukey);
      subscription = await stripe.subscriptions.create(
        {
          customer: data.customerId,
          default_tax_rates: [functions.config().stripe.tax],
          trial_period_days: data.trialUsed ? 0 : 7,
          items: [{ plan: planId }]
        },
        {
          idempotency_key: ukey
        }
      );
    }

    await db.doc(`users/${userId}`).update({
      plan: data.planId,
      trialUsed: true,
      isCaneclSubscription: false,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end
    });

    const user = (await db.doc(`users/${userId}`).get()).data() as any;

    await sendEmail({
      to: 'daichi.ninomiya@deer.co.jp',
      templateId: 'registerToAdmin',
      dynamicTemplateData: {
        email: user.email,
        name: user.name,
        plan: PLAN_LABELS[data.planId]
      }
    });

    await sendEmail({
      to: user.email,
      templateId: 'changePlan',
      dynamicTemplateData: {
        plan: PLAN_LABELS[data.planId]
      }
    });

    await db.doc(`users/${userId}/private/payment/`).update({
      subscriptionId: subscription.id,
      startedAt: new Date()
    });
  }
);
