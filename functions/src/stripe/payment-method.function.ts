import { Customer } from './../interfaces/customer';
import { stripe } from './client';
import { db } from './../utils/db';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import admin = require('firebase-admin');

export const getPaymentMethods = functions
  .region('asia-northeast1')
  .https.onCall(
    async (data, context): Promise<Stripe.ApiList<Stripe.PaymentMethod>> => {
      if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      const customer = (
        await db.doc(`customers/${context.auth.uid}`).get()
      ).data();

      if (!customer) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'there is no customer'
        );
      }

      return stripe.paymentMethods.list({
        customer: customer.customerId,
        type: 'card',
      });
    }
  );

export const setStripePaymentMethod = functions
  .region('asia-northeast1')
  .https.onCall(
    async (data: { paymentMethod: string }, context): Promise<void> => {
      if (!data) {
        throw new functions.https.HttpsError(
          'data-loss',
          'データが存在しません'
        );
      }

      if (!context.auth) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '認証エラーが発生しました。'
        );
      }

      const customerDoc = await db.doc(`customers/${context.auth.uid}`);
      const customer = (await customerDoc.get()).data() as Customer;

      if (!customer) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'プラットフォームにカスタマーが存在しません。'
        );
      }

      if (!customer.paymentMethods?.length) {
        await stripe.customers.update(customer.customerId, {
          invoice_settings: {
            default_payment_method: data.paymentMethod,
          },
        });
      }

      await customerDoc.update({
        paymentMethods: admin.firestore.FieldValue.arrayUnion(
          data.paymentMethod
        ),
        defaultPaymentMethod:
          customer.paymentMethods?.length > 0
            ? customer.defaultPaymentMethod
            : data.paymentMethod,
      });
    }
  );

export const deleteStripePaymentMethod = functions
  .region('asia-northeast1')
  .https.onCall(
    async (data: { id: string }, context): Promise<Stripe.PaymentMethod> => {
      if (!data) {
        throw new functions.https.HttpsError(
          'data-loss',
          'データが存在しません'
        );
      }

      if (!context.auth) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '認証エラーが発生しました。'
        );
      }

      const customerDoc = db.doc(`customers/${context.auth.uid}`);
      const customer = (await customerDoc.get()).data() as Customer;

      if (!customer) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'プラットフォームにカスタマーが存在しません。'
        );
      }

      await customerDoc.update({
        paymentMethods: admin.firestore.FieldValue.arrayRemove(data.id),
        defaultPaymentMethod:
          customer.paymentMethods?.length > 1
            ? customer.defaultPaymentMethod
            : null,
      });

      return stripe.paymentMethods.detach(data.id);
    }
  );

export const setStripeDefaultPaymentMethod = functions
  .region('asia-northeast1')
  .https.onCall(
    async (data: { id: string }, context): Promise<void> => {
      if (!data) {
        throw new functions.https.HttpsError(
          'data-loss',
          'データが存在しません'
        );
      }

      if (!context.auth) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '認証エラーが発生しました。'
        );
      }

      const customerDoc = db.doc(`customers/${context.auth.uid}`);
      const customer = (await customerDoc.get()).data() as Customer;

      if (!customer) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'プラットフォームにカスタマーが存在しません。'
        );
      }

      await stripe.customers.update(customer.customerId, {
        invoice_settings: {
          default_payment_method: data.id,
        },
      });

      await customerDoc.update({
        defaultPaymentMethod: data.id,
      });
    }
  );
