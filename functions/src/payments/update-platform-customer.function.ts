import * as functions from 'firebase-functions';

const stripe = require('stripe')(functions.config().stripe.key);

export const updatePlatformCustomer = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '権限がありません'
      );
    }

    return stripe.customers.update(data.customerId, {
      source: data.source,
      description: data.description
    });
  });
