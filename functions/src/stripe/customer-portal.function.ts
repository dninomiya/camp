import { StripeService } from './service';
import * as functions from 'firebase-functions';

export const getStripeCustomerPortalURL = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('permission-denied', 'not user');
    }

    const customer = await StripeService.getCampCustomer(context.auth.uid);

    if (!customer) {
      throw new functions.https.HttpsError('permission-denied', 'not customer');
    }

    try {
      const result = await StripeService.client.billingPortal.sessions.create({
        customer: customer.customerId,
      });

      return result.url;
    } catch (error) {
      throw new functions.https.HttpsError('unknown', error);
    }
  });
