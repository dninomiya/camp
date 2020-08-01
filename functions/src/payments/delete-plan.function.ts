import * as functions from 'firebase-functions';
import { db } from '../utils';

const firebaseTools = require('firebase-tools');
const stripe = require('stripe')(functions.config().stripe.key);

export const deletePlan = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new Error('認証エラー');
    }

    const paymentData: any = (
      await db.doc(`users/${context.auth.uid}/private/payment`).get()
    ).data();

    if (!paymentData || !paymentData.stripeUserId) {
      throw new Error('ストライプアカウントが存在しません');
    }

    await stripe.plans.delete(data.id, {
      stripe_account: paymentData.stripeUserId,
    });

    const members = await db
      .collection(`channels/${data.channelId}/plans/${data.pid}/members`)
      .get();

    await Promise.all(
      members.docs.map(async (doc) => {
        const member = doc.data();
        await db.doc(`users/${member.uid}/subscriptions/${data.pid}`).delete();
        return stripe.subscriptions.del(member.subscriptionId, {
          stripe_account: paymentData.stripeUserId,
        });
      })
    );

    return firebaseTools.firestore.delete(
      `channels/${data.channelId}/plans/${data.pid}`,
      {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token,
      }
    );
  });
