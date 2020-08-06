import * as functions from 'firebase-functions';
import { StripeService } from './service';
import Stripe from 'stripe';

export const getProduct = functions.region('asia-northeast1').https.onCall(
  async (id: string): Promise<Stripe.Product | undefined> => {
    let product;
    try {
      product = await StripeService.client.products.retrieve(id);
    } catch (error) {
      functions.logger.error(error.message);
    }
    return product;
  }
);
