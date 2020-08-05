import { StripeService } from './service';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

export const payStripeProduct = functions
  .region('asia-northeast1')
  .https.onCall(
    async (
      data: {
        priceId: string;
        connectedAccountId?: string;
      },
      context
    ) => {
      if (!data || !data.priceId) {
        throw new functions.https.HttpsError(
          'data-loss',
          '必要なデータがありません'
        );
      }

      if (!context.auth) {
        throw new functions.https.HttpsError(
          'permission-denied',
          '認証が必要です'
        );
      }

      const customer = await StripeService.getCampCustomer(context.auth.uid);

      if (!customer) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'カスタマーが存在しません'
        );
      }

      try {
        await StripeService.client.invoiceItems.create({
          customer: customer.customerId,
          price: data.priceId,
          tax_rates: [functions.config().stripe.tax],
        });

        const params: Stripe.InvoiceCreateParams = {
          customer: customer.customerId,
        };

        if (data.connectedAccountId) {
          params.application_fee_amount = 10;
          params.transfer_data = { destination: data.connectedAccountId };
        }

        const invoice = await StripeService.client.invoices.create(params);

        return StripeService.client.invoices.pay(invoice.id);
      } catch (error) {
        throw new functions.https.HttpsError('unauthenticated', error.code);
      }
    }
  );
