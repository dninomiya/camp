import { StripeService } from './service';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

export const getPaymentMethod = functions
  .region('asia-northeast1')
  .https.onCall(
    async (_, context): Promise<Stripe.PaymentMethod | null> => {
      const uid = context.auth?.uid;
      if (!uid) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      return StripeService.getPaymentMethod(uid);
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

      const uid = context.auth?.uid;

      if (!uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '認証エラーが発生しました。'
        );
      }

      const customer = await StripeService.getCampCustomer(uid);

      if (!customer) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '顧客が存在しません'
        );
      }

      if (customer.paymentMethod) {
        await StripeService.client.paymentMethods.detach(
          customer.paymentMethod
        );
      }

      await StripeService.updateCampCustomer(uid, {
        paymentMethod: data.paymentMethod,
      });

      await StripeService.client.customers.update(customer.customerId, {
        invoice_settings: {
          default_payment_method: data.paymentMethod,
        },
      });
    }
  );
