import * as functions from 'firebase-functions';
import {
  db,
  sendFCM
} from './utils';

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
      return sendFCM({
        token: targetData.fcmToken,
        notification: {
          title: `${data.thread.title}に返信がありました`,
          body: data.body
        }
      });
    }
  });

export const createThread = functions.firestore
  .document('threads/{threadId}')
  .onCreate(async (snapshot) => {
    const thread = snapshot.data();

    if (!thread) {
      throw new Error('data is broken');
    }

    const target = await db.doc(`users/${thread.targetId}`).get();
    const targetData = target.data();

    if (targetData && targetData.fcmToken) {
      return sendFCM({
        token: targetData.fcmToken,
        notification: {
          title: `リクエストが届きました`,
          body: thread.title
        }
      });
    }
  });

export const updateThread = functions.firestore
  .document('threads/{threadId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before || !after) {
      throw new Error('data is broken');
    }

    if (before.status !== after.status) {
      const thread = after;
      const target = await db.doc(`users/${thread.authorId}`).get();
      const targetData = target.data();
      const action = after.status === 'open' ? 'オープン' : 'クローズ';

      if (targetData && targetData.fcmToken) {
        return sendFCM({
          token: targetData.fcmToken,
          notification: {
            title: `リクエストが${action}しました！`,
            body: thread.title
          }
        });
      }
    }
  });
