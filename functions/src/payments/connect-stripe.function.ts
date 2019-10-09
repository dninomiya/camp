import * as functions from 'firebase-functions';
import { db } from '../utils';

// const planTemplates = [
//   {
//     type: 'question',
//     description: '質問に答えます',
//     amount: 1000,
//     per: 'time',
//     active: false
//   },
//   {
//     type: 'review',
//     description: 'ソースレビューを受け付けます',
//     amount: 10000,
//     per: 'time',
//     active: false
//   },
//   {
//     type: 'trouble',
//     description: 'トラブルシューティングを受け付けます',
//     amount: 10000,
//     per: 'time',
//     active: false
//   },
//   {
//     type: 'coaching',
//     description: 'コーチングを行います',
//     amount: 10000,
//     per: 'coaching',
//     active: false
//   }
// ];

const stripe = require('stripe')(functions.config().stripe.key);

export const connectStripe = functions.https.onCall(async (data, context) => {

  try {
    const account = await stripe.accounts.create({
      country: 'JP',
      type: 'custom',
      ...data
    });

    if (context.auth) {
      return db.doc(`users/${context.auth.uid}/private/connect`).set({
        stripeUserId: account.id,
      });
    } else {
      throw new Error('権限がありません');
    }
  } catch(error) {
    console.error(new Error(error));
    throw new functions.https.HttpsError('invalid-argument', error.message);
  }
});
