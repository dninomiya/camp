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

    const authorThreads = (
      await db.collection('threads').where('authorId', '==', uid).get()
    ).docs;
    const targetThreads = (
      await db.collection('threads').where('targetId', '==', uid).get()
    ).docs;

    for (const doc of authorThreads.concat(targetThreads)) {
      await doc.ref.set({ status: 'closed' });
    }

    await admin
      .auth()
      .deleteUser(uid)
      .then(() => {
        functions.logger.info(`ID: ${uid} を完全に削除しました`);
      });

    if (data && data.email) {
      await sendEmail({
        to: data.email,
        templateId: 'deleteAccount',
      });
    }
  });
