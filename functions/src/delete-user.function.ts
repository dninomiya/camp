import * as functions from 'firebase-functions';
import { db } from './utils';
import * as admin from 'firebase-admin';
import { deleteCustomer } from './payments/shared';
import { checkAdmin } from './utils/db';

const firebaseTools = require('firebase-tools');

const deleteStripeCustomer = async (uid: string): Promise<void> => {
  const payment = await db.doc(`users/${uid}/private/payment`).get();
  const paymentData = payment && payment.data();

  console.log('カスタマーを削除します...');

  if (paymentData) {
    return deleteCustomer(
      paymentData.customerId,
      paymentData.subscriptionId
    ).then(() => {
      console.log('カスタマーを削除しました');
    })
    .catch(() => {
      console.log('カスタマーは存在しません');
    });
  }
}

const checkPermission = async (uid: string, context: any) => {
  let status = false;

  if (context.auth) {
    const isOwner = uid === context.auth.uid;
    const isAdmin = await checkAdmin(context.auth.uid);

    if (isAdmin || isOwner) {
      status = true;
    }
  }

  if (!status) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'ユーザー削除を行う権限がありません'
    );
  }
}

export const deleteUser = functions.runWith({
  timeoutSeconds: 540,
  memory: '2GB'
}).https.onCall(async (data, context) => {
  const uid = data.uid;

  await checkPermission(uid, context);
  await deleteStripeCustomer(uid);

  console.log(`ID: ${uid} の完全削除を行います...`);

  await firebaseTools.firestore.delete(`users/${uid}`, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true,
    token: functions.config().fb.token
  });

  return admin.auth().deleteUser(uid).then(() => {
    console.log(`ID: ${uid} を完全に削除しました`);
  });
});
