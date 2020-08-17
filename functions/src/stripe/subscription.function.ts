import { config } from './../config';
import { sendEmail } from './../utils/sendgrid';
import { StripeService } from './service';
import { db, toTimeStamp } from './../utils/db';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import * as moment from 'moment';

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

export const createStripeSubscription = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        planId: 'lite' | 'solo' | 'mentor' | 'mentorLite';
        priceId: string;
        couponId?: string;
      },
      context
    ) => {
      const uid = context.auth?.uid;

      if (!uid) {
        throw new Error('認証エラー');
      }

      const stripeCustomer = await StripeService.getStripeCustomer(uid);
      const user = (await db.doc(`users/${uid}`).get()).data();

      if (!stripeCustomer || !user) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '顧客が存在しません'
        );
      }

      const subscriptionId = await StripeService.getSubscriptionId(uid);
      let subscription: Stripe.Subscription;

      if (subscriptionId) {
        functions.logger.info('プラン変更: ' + subscriptionId);
        subscription = await StripeService.client.subscriptions.update(
          subscriptionId,
          {
            items: [{ price: data.priceId }],
            expand: ['latest_invoice.payment_intent'],
          }
        );
      } else {
        functions.logger.info('check');
        const ukey = moment().format('YYYY-MM-DD-HH') + '-' + uid;
        subscription = await StripeService.client.subscriptions.create(
          {
            customer: stripeCustomer.id,
            items: [{ price: data.priceId }],
            default_tax_rates: [functions.config().stripe.tax],
            coupon: data.couponId,
            trial_from_plan: user.trialUsed,
            expand: ['latest_invoice.payment_intent'],
          },
          {
            idempotency_key: ukey,
          }
        );
        functions.logger.info('check2');
      }

      await db.doc(`users/${uid}`).update({
        plan: data.planId,
        trialUsed: true,
        isTrial: !user.trialUsed,
        isCaneclSubscription: false,
        currentPeriodStart: toTimeStamp(subscription.current_period_start),
        currentPeriodEnd: toTimeStamp(subscription.current_period_end),
      });

      const product = await StripeService.getProductByPrice(data.priceId);

      await sendEmail({
        to: 'daichi.ninomiya@deer.co.jp',
        templateId: 'registerToAdmin',
        dynamicTemplateData: {
          email: user.email,
          name: user.name,
          plan: product.name,
        },
      });

      await sendEmail({
        to: user.email,
        templateId: 'changePlan',
        dynamicTemplateData: {
          plan: product.name,
        },
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;

      if (subscription.status === 'active') {
        return subscription;
      } else if (
        (invoice?.payment_intent as Stripe.PaymentIntent)?.status ===
        'requires_payment_method'
      ) {
        throw new functions.https.HttpsError(
          'unimplemented',
          'カードは拒否されました'
        );
      } else {
        throw new functions.https.HttpsError(
          'unimplemented',
          'サブスクリプションが失敗しました'
        );
      }
    }
  );

export const cancelStripeSubscription = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        reason: {
          types: string[];
          detail: string;
        };
        plan: string;
      },
      context
    ) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      const subscriptionId = await StripeService.getSubscriptionId(
        context.auth.uid
      );

      if (!subscriptionId) {
        throw new functions.https.HttpsError(
          'data-loss',
          'サブスクリプションがありません'
        );
      }

      try {
        await StripeService.client.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      } catch (error) {
        throw new functions.https.HttpsError('unauthenticated', error.code);
      }

      const customer = await StripeService.getStripeCustomer(context.auth.uid);

      if (customer) {
        await sendEmail({
          to: config.adminEmail,
          templateId: 'unRegisterToAdmin',
          dynamicTemplateData: {
            email: customer.email,
            name: customer.name,
            plan: data.plan,
            reasons: data.reason.types,
            reasonDetail: data.reason.detail || 'なし',
          },
        });
      }

      await db.doc(`users/${context.auth.uid}/private/payment`).update({
        isCaneclSubscription: true,
      });

      const user = (await db.doc(`users/${context.auth.uid}`).get()).data();

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

      if (user) {
        return db.collection('unsubscribeReasons').add({
          userId: context.auth.uid,
          planId: user.plan,
          reason: reasons,
        });
      } else {
        return;
      }
    }
  );

export const restartStripeSubscription = functions
  .region('asia-northeast1')
  .https.onCall(async (_, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    const subscriptionId = await StripeService.getSubscriptionId(
      context.auth.uid
    );

    if (!subscriptionId) {
      throw new functions.https.HttpsError(
        'data-loss',
        'サブスクリプションが存在しません'
      );
    }

    try {
      await StripeService.client.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    } catch (error) {
      throw new functions.https.HttpsError('unauthenticated', error.code);
    }

    return db.doc(`users/${context.auth.uid}`).update({
      isCaneclSubscription: false,
    });
  });

export const deleteSubscription = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    const data = req.body.data.object;
    const uid = StripeService.getCampUidByCustomerId(data.customer);

    if (uid) {
      const user: any = (await db.doc(`users/${uid}`).get()).data();

      await db.doc(`users/${uid}`).update({
        plan: 'free',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        isCaneclSubscription: false,
      });

      await sendEmail({
        to: config.adminEmail,
        templateId: 'downgradeToAdmin',
        dynamicTemplateData: {
          name: user.name,
          oldPlan: user.plan,
          newPlan: 'フリー',
        },
      });

      await sendEmail({
        to: user.email,
        templateId: 'changePlan',
        dynamicTemplateData: {
          plan: 'フリー',
        },
      });
    }

    res.status(200).send(true);
  });

export const getActivePriceId = functions
  .region('asia-northeast1')
  .https.onCall((_, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    return StripeService.getActivePriceId(context.auth.uid);
  });

export const getStripeRetrieveUpcoming = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        coupon?: string;
        price: string;
      },
      context
    ) => {
      const uid = context.auth?.uid;

      if (!uid) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      const customer = await StripeService.getStripeCustomer(uid);

      if (!customer) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      const subs = customer.subscriptions?.data[0];

      console.log(data.coupon);

      const res = await StripeService.client.invoices.retrieveUpcoming({
        customer: customer.id,
        subscription: subs?.id,
        subscription_items: [
          {
            id: subs?.items.data[0].id,
            price: data.price,
          },
        ],
        coupon: data.coupon || undefined,
      });

      return res;
    }
  );
