import * as functions from 'firebase-functions';
import { StripeService } from './service';
import Stripe from 'stripe';

export const getStripeCoupon = functions.region('asia-northeast1').https.onCall(
  async (id: string): Promise<Stripe.Coupon | undefined> => {
    const coupon = await StripeService.client.coupons.retrieve(id);
    if (coupon.valid) {
      return coupon;
    } else {
      return;
    }
  }
);

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
