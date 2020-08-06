import * as functions from 'firebase-functions';
import { StripeService } from './service';
import Stripe from 'stripe';

export const getStripePrices = functions.region('asia-northeast1').https.onCall(
  async (product: string): Promise<Stripe.Price[] | undefined> => {
    let prices;

    try {
      prices = (
        await StripeService.client.prices.list({
          product,
          active: true,
        })
      ).data;
    } catch (error) {
      functions.logger.error(error.message);
    }

    return prices;
  }
);
