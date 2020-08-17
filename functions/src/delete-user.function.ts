import { StripeService } from './stripe/service';
import * as functions from 'firebase-functions';
import { db, sendEmail } from './utils';
import * as admin from 'firebase-admin';
import { checkAdmin } from './utils/db';

const firebaseTools = require('firebase-tools');

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
};

export const deleteUser = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const uid = data.uid;

    if (!uid)
      throw new functions.https.HttpsError(
        'permission-denied',
        '権限がありません'
      );

    await checkPermission(uid, context);
    await StripeService.deleteCustomerByUid(uid);

    functions.logger.info(`ID: ${uid} の完全削除を行います...`);

    await firebaseTools.firestore.delete(`users/${uid}`, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    });

    const lessons = await db
      .collection('lessons')
      .where('authorId', '==', uid)
      .get();

    for (const doc of lessons.docs) {
      await doc.ref.set({ deleted: true });
    }

    await admin
      .auth()
      .deleteUser(uid)
      .then(() => {
        functions.logger.info(`ID: ${uid} を完全に削除しました`);
      });

    const customer = await StripeService.getStripeCustomer(uid);
    if (customer) {
      await StripeService.client.customers.del(customer.id);
    }
    await db.doc(`customers/${uid}`).delete();

    if (data && data.email) {
      await sendEmail({
        to: data.email,
        templateId: 'deleteAccount',
      });
    }
  });
