import { db } from './../utils/db';
import { StripeService } from './service';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

/**
 * 設定フローを作成
 */
export const createStripeSetupIntent = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        name: string;
        email: string;
      },
      context
    ): Promise<Stripe.SetupIntent> => {
      const uid = context.auth?.uid;

      if (!uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '認証エラーが発生しました。'
        );
      }

      const customer = await StripeService.getCampCustomer(uid);

      let customerId = customer?.customerId;

      if (!customer) {
        customerId = await StripeService.createStripeCustomer({
          name: data.name,
          email: data.email,
        });

        await db.doc(`users/${uid}/private/payment`).set(
          {
            customerId,
          },
          { merge: true }
        );
      }

      return StripeService.client.setupIntents.create({
        payment_method_types: ['card'],
        customer: customerId,
      });
    }
  );
