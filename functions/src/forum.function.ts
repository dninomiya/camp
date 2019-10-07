import * as functions from 'firebase-functions';
import { db } from './utils';
import * as admin from 'firebase-admin';

export const createReply = functions.firestore
  .document('threads/{threadId}/replies/{rid}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    if (!data) {
      throw new Error('data is broken');
    }

    const target = await db.doc(`users/${data.thread.targetId}`).get();
    const targetData = target.data();

    if (targetData && targetData.fcmToken) {
      const message = {
        notification: {
          'title': `${data.thread.data.title}に返信がありました`,
          'body': data.body
        },
        android: {
          ttl: 8000,
        },
        token: targetData.fcmToken
      };

      return admin.messaging().send(message)
        .then((response) => {
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    } else {
      return 'none';
    }
  });
