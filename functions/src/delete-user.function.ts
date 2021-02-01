import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { sendEmail } from './utils';

export const deleteUser = functions
  .region('asia-northeast1')
  .https.onCall(async (user, context) => {
    if (!context.auth?.uid) {
      return;
    }

    await admin.auth().deleteUser(context.auth?.uid);

    if (user?.email) {
      await sendEmail({
        to: user.email,
        templateId: 'deleteAccount',
      });
    }
  });
