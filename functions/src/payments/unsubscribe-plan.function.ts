import { sendEmail } from './../utils/sendgrid';
import * as functions from 'firebase-functions';
import { db } from '../utils';
import { config } from '../config';

const stripe = require('stripe')(functions.config().stripe.key);

const REASONS = [
  {
    type: 'goal',
    label: '目標達成した',
  },
  {
    type: 'quality',
    label: 'クオリティが低い',
  },
  {
    type: 'volume',
    label: 'コンテンツが少ない',
  },
  {
    type: 'cost',
    label: '料金が高い',
  },
  {
    type: 'reply',
    label: '返信、反応がない、遅い',
  },
  {
    type: 'other',
    label: 'その他',
  },
];

const PLAN_LABELS = {
  lite: 'ライト',
  solo: 'ソロ',
  mentor: 'メンター',
};

export const unsubscribePlan = functions.region('asia-northeast1').https.onCall(
  async (
    data: {
      userId: string;
      planId: string;
      reason: {
        types: string[];
        detail: string;
      };
    },
    context
  ) => {
    console.log(data);
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

    const reasons = data.reason.types
      .map((type: string) => {
        const item = REASONS.find((reason) => reason.type === type);
        if (item) {
          return item.label;
        } else {
          return null;
        }
      })
      .filter((label) => !!label)
      .join(' / ');

    await db.collection(`unsubscribeReasons`).add(data);

    await sendEmail({
      to: config.adminEmail,
      templateId: 'unRegisterToAdmin',
      dynamicTemplateData: {
        email: user.email,
        name: user.name,
        plan: PLAN_LABELS[plan],
        reasons,
        reasonDetail: data.reason.detail || 'なし',
      },
    });

    await stripe.subscriptions.update(userPayment.subscriptionId, {
      cancel_at_period_end: true,
    });

    return db.doc(`users/${data.userId}`).update({
      isCaneclSubscription: true,
    });
  }
);
