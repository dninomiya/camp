import * as functions from 'firebase-functions';
import {
  db,
  sendFCM,
  sendEmail,
  addNotification
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

    if (targetData) {
      await sendEmail({
        to: targetData.email,
        templateId: 'reply',
        dynamicTemplateData: {
          id: data.thread.id,
          title: data.thread.title
        }
      })

      await addNotification(
        target.id,
        {
          title: `「${data.thread.title}」に返信がありました`,
          url: `/forum/${data.thread.id}?status=${data.thread.status}`
        }
      );
    }

    if (targetData && targetData.fcmToken) {
      return sendFCM({
        token: targetData.fcmToken,
        notification: {
          title: `${data.thread.title}に返信がありました`,
          body: data.body,
          click_action: `http://localhost:4200/forum/${data.thread.id}`
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

    if (targetData) {
      await addNotification(target.id, {
        title: 'リクエストが届きました',
        url: `/forum/${thread.id}?status=request`
      });

      await sendEmail({
        to: targetData.email,
        templateId: 'request',
        dynamicTemplateData: {
          id: thread.id,
          title: thread.title
        }
      })
    }

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

      let templateId = thread.status;

      if (templateId === 'closed' && thread.isReject) {
        templateId = 'reject';
      }

      if (targetData) {
        await sendEmail({
          to: targetData.email,
          templateId,
          dynamicTemplateData: {
            id: thread.id,
            title: thread.title
          }
        })

        await addNotification(
          target.id,
          {
            title: `「${thread.title}」が${action}しました`,
            url: `/forum/${thread.id}?status=${thread.status}`
          }
        );
      }

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
