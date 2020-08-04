import { db } from './../utils/db';
import { Customer } from './../interfaces/customer';
import { stripe } from './client';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

export const createStripeSubscription = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        priceId: string;
        couponId?: string;
        stripeAccount?: string;
      },
      context
    ) => {
      if (!data || !data.priceId) {
        throw new functions.https.HttpsError('data-loss', 'not customer');
      }

      if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      const customer: Customer = (
        await db.doc(`customers/${context.auth.uid}`).get()
      ).data() as Customer;

      const params: Stripe.SubscriptionCreateParams = {
        customer: customer.customerId,
        items: [{ price: data.priceId }],
        default_tax_rates: [functions.config().stripe.tax],
        coupon: data.couponId,
        expand: ['latest_invoice.payment_intent'],
      };

      if (data.stripeAccount) {
        params.application_fee_percent = 10;
        params.transfer_data = {
          destination: data.stripeAccount,
        };
      }

      const subscription = await stripe.subscriptions.create(params);
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
      await stripe.subscriptions.update(subscriptionId, {
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
      await stripe.subscriptions.update(subscriptionId, {
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
  .https.onCall(async (data: { product?: string; stripeAccount?: string }) => {
    const params: Stripe.PriceListParams = {
      active: true,
      product: data.product,
      type: 'recurring',
      expand: ['data.product'],
    };

    return stripe.prices
      .list(params, {
        stripeAccount: data.stripeAccount,
      })
      .then((prices) => prices.data[0]);
  });

export const getAllStripeCoupons = functions
  .region('asia-northeast1')
  .https.onCall(async (product: string) => {
    return (await stripe.coupons.list()).data;
  });

export const deleteSubscription = functions
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
      return stripe.subscriptions.del(subscriptionId);
    } catch (error) {
      throw new functions.https.HttpsError('unauthenticated', error.code);
    }
  });

export const onDeleteStripeSubscription = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const customer: string = req.body.data.object.customer;
    const doc = (
      await db.collection('customers').where('customerId', '==', customer).get()
    ).docs[0];

    if (doc) {
      await doc.ref.update({
        plan: null,
      });
    }

    res.status(200).send('success');
  });
