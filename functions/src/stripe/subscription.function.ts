import { StripeService } from './service';
import { db } from './../utils/db';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

export const createStripeSubscription = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        priceId: string;
        couponId?: string;
      },
      context
    ) => {
      if (!data || !data.priceId) {
        throw new functions.https.HttpsError('data-loss', 'not customer');
      }

      if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      const customer = await StripeService.getCampCustomer(context.auth.uid);

      if (!customer) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '顧客が存在しません'
        );
      }

      const subscription = await StripeService.client.subscriptions.create({
        customer: customer.customerId,
        items: [{ price: data.priceId }],
        default_tax_rates: [functions.config().stripe.tax],
        coupon: data.couponId,
        expand: ['latest_invoice.payment_intent'],
      });
      const invoice = subscription.latest_invoice as Stripe.Invoice;

      if (subscription.status === 'active') {
        await db.doc(`customers/${context.auth.uid}`).set(
          {
            plan: subscription.items.data[0].price.product,
          },
          { merge: true }
        );

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
  .https.onCall(async (subscriptionId: string, context) => {
    if (!subscriptionId) {
      throw new functions.https.HttpsError(
        'data-loss',
        'サブスクリプションIDが見つかりません'
      );
    }

    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    try {
      await StripeService.client.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (error) {
      throw new functions.https.HttpsError('unauthenticated', error.code);
    }

    return db.doc(`customers/${context.auth.uid}`).update({
      cancelAtPeriodEnd: true,
    });
  });

export const restartStripeSubscription = functions
  .region('asia-northeast1')
  .https.onCall(async (subscriptionId: string, context) => {
    if (!subscriptionId) {
      throw new functions.https.HttpsError(
        'data-loss',
        'サブスクリプションIDが見つかりません'
      );
    }

    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    try {
      await StripeService.client.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    } catch (error) {
      throw new functions.https.HttpsError('unauthenticated', error.code);
    }

    return db.doc(`customers/${context.auth.uid}`).update({
      cancelAtPeriodEnd: false,
    });
  });

export const getStripePrices = functions
  .region('asia-northeast1')
  .https.onCall(async (ids: string[]) => {
    return Promise.all(
      ids.map((id) => StripeService.client.prices.retrieve(id))
    );
  });

export const getAllStripeCoupons = functions
  .region('asia-northeast1')
  .https.onCall(async (product: string) => {
    return (await StripeService.client.coupons.list()).data;
  });

export const onDeleteStripeSubscription = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const customer: string = req.body.data.object.customer;
    const doc = (
      await db
        .collectionGroup('private')
        .where('customerId', '==', customer)
        .get()
    ).docs[0];

    if (doc) {
      await doc.ref.update({
        plan: 'free',
      });
    }

    res.status(200).send('success');
  });
