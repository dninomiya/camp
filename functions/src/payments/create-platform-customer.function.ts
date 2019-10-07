import * as functions from 'firebase-functions';
import { db } from '../utils';
const stripe = require('stripe')(functions.config().stripe.key);

export const createPlatformCustomer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'permission-denied',
      '権限がありません'
    );
  }

  const customer = await stripe.customers.create(data);

  return db.doc(`users/${context.auth.uid}/private/payment`).set({
    customerId: customer.id
  }, {merge: true});
});
