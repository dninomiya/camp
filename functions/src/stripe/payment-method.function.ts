import { StripeService } from './service';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

export const getPaymentMethod = functions
  .region('asia-northeast1')
  .https.onCall(
    async (_, context): Promise<Stripe.PaymentMethod | null> => {
      if (!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'not user');
      }

      const customer = await StripeService.getCampCustomer(context.auth.uid);

      if (!customer || !customer.paymentMethod) {
        return null;
      }

      return StripeService.client.paymentMethods.retrieve(
        customer.paymentMethod
      );
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

      const customer = await StripeService.getCampCustomer(context.auth.uid);

      if (customer?.paymentMethod) {
        await StripeService.client.customers.update(customer.customerId, {
          invoice_settings: {
            default_payment_method: data.paymentMethod,
          },
        });
      }

      return StripeService.updateCampCustomer(context.auth.uid, {
        defaultPaymentMethod: data.paymentMethod,
      });
    }
  );

export const getStripeInvoices = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        startingAfter?: string;
        endingBefore?: string;
      },
      context
    ): Promise<Stripe.ApiList<Stripe.Charge> | null> => {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '認証が必要です'
        );
      }

      const customer = await StripeService.getCampCustomer(context.auth.uid);

      if (customer) {
        const params: Stripe.ChargeListParams = {
          customer: customer.customerId,
          limit: 10,
          expand: ['data.invoice'],
        };

        if (data?.startingAfter) {
          params.starting_after = data.startingAfter;
        }

        if (data?.endingBefore) {
          params.ending_before = data.endingBefore;
        }

        return StripeService.client.charges.list(params);
      } else {
        return null;
      }
    }
  );
