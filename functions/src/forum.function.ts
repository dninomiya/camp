import * as functions from 'firebase-functions';
import {
  db,
  sendFCM,
  sendEmail,
  addNotification,
  sendNotification
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

    const item = {
      title: `「${data.thread.title}」に返信がありました`,
      path: `/forum/${data.thread.id}?status=${data.thread.status}`,
      body: data.body,
    };

    if (targetData) {
      await sendNotification({
        item: {
          type: 'reply',
          ...item
        },
        target: {
          uid: targetData.id,
          email: targetData.email,
          fcmToken: targetData.fcmToken,
          notification: targetData.notification
        },
        dynamicTemplateData: item
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
    const item = {
      title: `リクエスト「${thread.thread.title}」がありました`,
      path: `/forum/${thread.id}?status=request`,
      body: thread.body,
    };

    if (targetData) {
      await sendNotification({
        item: {
          type: 'reply',
          ...item
        },
        target: {
          uid: targetData.id,
          email: targetData.email,
          fcmToken: targetData.fcmToken,
          notification: targetData.notification
        },
        dynamicTemplateData: item
      })
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
      let templateId = thread.status;
      if (templateId === 'closed' && thread.isReject) {
        templateId = 'reject';
      }

      const item = {
        title: `「${thread.title}」が${action}しました`,
        path: `/forum/${thread.id}?status=${thread.status}`,
        body: thread.body,
      };

      if (targetData) {
        await sendNotification({
          item: {
            type: 'reply',
            ...item
          },
          target: {
            uid: targetData.id,
            email: targetData.email,
            fcmToken: targetData.fcmToken,
            notification: targetData.notification
          },
          dynamicTemplateData: item
        })
      }
    }
  });
