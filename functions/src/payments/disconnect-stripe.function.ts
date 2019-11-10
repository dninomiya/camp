import * as functions from 'firebase-functions';
import { db } from '../utils';
const stripe = require('stripe')(functions.config().stripe.key);

export const disconnectStripe = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall(async (data: {
    stripeUserId: string;
  }, context) => {
    if (!context.auth) {
      return new functions.https.HttpsError('permission-denied', '認証エラー');
    }

    await stripe.oauth.deauthorize({
      client_id: functions.config().stripe.client_id,
      stripe_user_id: data.stripeUserId,
    });

    return db.doc(`users/${context.auth.uid}/private/connect`).delete();
  });
