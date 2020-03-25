import * as functions from 'firebase-functions';
import { db, sendNotification, charge } from './utils';

export const createReply = functions
  .region('asia-northeast1')
  .firestore.document('threads/{threadId}/replies/{rid}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    if (!data) {
      throw new Error('data is broken');
    }

    const targetId =
      data.authorId === data.thread.authorId
        ? data.thread.targetId
        : data.thread.authorId;
    const target = await db.doc(`users/${targetId}`).get();
    const targetData = target.data();

    const item = {
      title: `「${data.thread.title}」に返信がありました`,
      path: `/forum/${data.thread.id}?status=${data.thread.status}`,
      body: data.body
    };

    if (targetData) {
      await sendNotification({
        item: {
          type: 'reply',
          ...item
        },
        target: {
          id: targetData.id,
          email: targetData.email,
          fcmToken: targetData.fcmToken,
          mailSettings: targetData.mailSettings
        },
        dynamicTemplateData: item
      });
    }
  });

export const checkThreadPaymentStatus = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const result = await Promise.all([
      db.doc(`users/${data.customerId}`).get(),
      db.doc(`users/${data.sellerId}`).get()
    ]);

    const customer = result[0].data();
    const seller = result[1].data();

    return {
      customer: customer && customer.isCustomer,
      seller: seller && seller.isSeller
    };
  });

export const createThread = functions
  .region('asia-northeast1')
  .firestore.document('threads/{threadId}')
  .onCreate(async snapshot => {
    const thread = snapshot.data();

    if (!thread) {
      throw new Error('data is broken');
    }

    const target = await db.doc(`users/${thread.targetId}`).get();
    const targetData = target.data();
    const item = {
      title: `リクエスト「${thread.title}」がありました`,
      path: `/forum/${thread.id}?status=request`,
      body: thread.body
    };

    if (targetData) {
      await sendNotification({
        item: {
          type: 'request',
          ...item
        },
        target: {
          id: targetData.id,
          email: targetData.email,
          fcmToken: targetData.fcmToken,
          mailSettings: targetData.mailSettings
        },
        dynamicTemplateData: item
      });
    }
  });

export const updateThread = functions
  .region('asia-northeast1')
  .firestore.document('threads/{threadId}')
  .onUpdate(async change => {
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
        body: thread.body
      };

      if (targetData) {
        await sendNotification({
          item: {
            type: templateId,
            ...item
          },
          target: {
            id: targetData.id,
            email: targetData.email,
            fcmToken: targetData.fcmToken,
            mailSettings: targetData.notification
          },
          dynamicTemplateData: item
        });

        if (after.status === 'open') {
          const customer = (
            await db.doc(`users/${target.id}/private/payment`).get()
          ).data();
          const customerId = customer && customer.customerId;
          const seller = (
            await db.doc(`users/${thread.targetId}/private/connect`).get()
          ).data();
          const sellerId = seller && seller.stripeUserId;

          if (!seller) {
            throw new Error('セラーが存在しません');
          }

          await charge({
            item: {
              id: thread.id,
              path: item.path,
              title: item.title,
              amount: thread.plan.amount
            },
            customer: {
              id: customerId,
              uid: target.id
            },
            seller: {
              id: sellerId,
              email: seller.email,
              uid: thread.targetId
            }
          });
        }
      }
    }
  });
