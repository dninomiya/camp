import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { db } from './../utils/db';
import { StripeService } from './service';

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
