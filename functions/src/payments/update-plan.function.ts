import * as functions from 'firebase-functions';
import { db } from '../utils';

const stripe = require('stripe')(functions.config().stripe.key);

export const updatePlan = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new Error('ユーザーが存在しません');
    }

    const uid = context.auth.uid;
    const connectData: any = (
      await db.doc(`users/${uid}/private/connect`).get()
    ).data();

    if (!connectData || !connectData.stripeUserId) {
      throw new Error('ストライプアカウントが存在しません');
    }

    return stripe.plans
      .update(
        data.id,
        {
          nickname: data.nickname
        },
        {
          stripe_account: connectData.stripeUserId
        }
      )
      .then((result: any) => {
        return db.doc(`channels/${uid}/plans/${result.id}`).update({
          ...data,
          id: result.id
        });
      })
      .catch(async (error: string) => {
        console.error(error);
        await db.doc(`channels/${uid}/plans/${data.id}`).delete();
        throw new Error('プランが存在しませんでした');
      });
  });
