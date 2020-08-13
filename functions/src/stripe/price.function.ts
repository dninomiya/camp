import * as functions from 'firebase-functions';
import { StripeService } from './service';
import Stripe from 'stripe';

export const getStripePrice = functions.region('asia-northeast1').https.onCall(
  (priceId: string): Promise<Stripe.Price | undefined> => {
    return StripeService.client.prices.retrieve(priceId, {
      expand: ['product'],
    });
  }
);

export const getStripePrices = functions.region('asia-northeast1').https.onCall(
  async (product: string): Promise<Stripe.Price[] | undefined> => {
    let prices;

    try {
      prices = (
        await StripeService.client.prices.list({
          product,
          active: true,
          expand: ['data.product'],
        })
      ).data;
    } catch (error) {
      functions.logger.error(error.message);
    }

    return prices;
  }
);
