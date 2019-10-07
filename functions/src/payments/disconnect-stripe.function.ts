import * as functions from 'firebase-functions';
import { db } from '../utils';
import { deleteAll } from '../utils/db';

export const disconnectStripe = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall(async (data: {
    channelId: string;
    clientId: string;
  }, context) => {
    if (!context.auth) {
      return new functions.https.HttpsError('permission-denied', '認証エラー');
    }

    await db.doc(`users/${context.auth.uid}/private/payment`).delete();
    await deleteAll(`channels/${context.auth.uid}/plans`);
    return deleteAll(`channels/${context.auth.uid}/customers`);
  });
