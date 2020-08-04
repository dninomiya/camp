import { db } from './../utils/db';
import { stripe } from './client';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import admin = require('firebase-admin');

export const createStripeProductAndPrice = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        name: string;
        amount: number;
        interval: string;
        trialPeriodDays?: number;
      },
      context
    ) => {
      if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      if (!data.name || !data.amount || !data.interval) {
        throw new functions.https.HttpsError('data-loss', 'data loss');
      }

      const product = await stripe.products.create({
        name: data.name,
      });

      const params: Stripe.PriceCreateParams = {
        unit_amount: data.amount,
        product: product.id,
        nickname: data.name,
        currency: 'jpy',
      };

      if (data.interval !== 'none') {
        params.recurring = {
          interval: data.interval as any,
          trial_period_days: data.trialPeriodDays,
        };
      }

      await stripe.prices.create(params);

      return db.doc(`connectedAccounts/${context.auth.uid}`).update({
        products: admin.firestore.FieldValue.arrayUnion(product.id),
      });
    }
  );

export const deleteStripePrice = functions
  .region('asia-northeast1')
  .https.onCall(async (id: string, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    if (!id) {
      throw new functions.https.HttpsError('data-loss', 'data loss');
    }

    await stripe.prices.update(id, {
      active: false,
    });

    return db.doc(`createdAccounts/${context.auth.uid}`).update({
      products: admin.firestore.FieldValue.arrayRemove(id),
    });
  });
