import * as functions from 'firebase-functions';
import { StripeService } from './service';
import Stripe from 'stripe';

export const getAllStripeCoupons = functions
  .region('asia-northeast1')
  .https.onCall(
    async (): Promise<Stripe.Coupon[] | undefined> => {
      let coupons;
      try {
        coupons = (await StripeService.client.coupons.list()).data;
      } catch (error) {
        functions.logger.error(error.message);
      }

      return coupons;
    }
  );
