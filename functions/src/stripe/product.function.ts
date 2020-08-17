import * as functions from 'firebase-functions';
import { StripeService } from './service';
import Stripe from 'stripe';

export const getStripeProduct = functions
  .region('asia-northeast1')
  .https.onCall(
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

export const getAllStripeProducts = functions
  .region('asia-northeast1')
  .https.onCall(
    async (): Promise<Stripe.Product[] | undefined> => {
      const res = await StripeService.client.products.list();
      return res?.data;
    }
  );
