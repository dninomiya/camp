import { db } from './../utils/db';
import { StripeService } from './service';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

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
          limit: 20,
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

export const usePoint = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const invoice: Stripe.Invoice = req.body.data.object;
    const uid: string | undefined = await StripeService.getCampUidByCustomerId(
      invoice.customer as string
    );
    if (!uid) {
      res.status(200).send('no-user');
      return;
    }

    const user = (await db.doc(`users/${uid}`).get()).data();

    if (
      user?.point &&
      invoice.ending_balance === null &&
      invoice.amount_due > 0 &&
      invoice.status === 'draft'
    ) {
      await StripeService.client.invoiceItems.create({
        invoice: invoice.id,
        customer: invoice.customer as string,
        amount: -user.point,
        currency: 'jpy',
        description: 'ポイント割引',
      });
      res.status(200).send('success');
    } else {
      res.status(200).send('user undefined or invoice is not editable');
    }
  });
