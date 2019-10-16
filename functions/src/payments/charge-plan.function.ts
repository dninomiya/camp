import * as functions from 'firebase-functions';
import { db, charge, sendNotification } from '../utils';
import { MailTemplate } from '../interfaces';

export const chargePlan = functions.https.onCall(async (data: {
  item: {
    id: string;
    path: string;
    title: string;
    body: string;
    amount: number;
    type: MailTemplate;
  },
  sellerUid: string;
  customerUid: string;
}, context) => {

  if (!context.auth) {
    throw new Error('認証エラー');
  }

  const { item } = data;
  const connect = (await db.doc(`users/${data.sellerUid}/private/connect`).get()).data();
  const sellerId = connect && connect.stripeUserId;
  const customer = (await db.doc(`users/${data.customerUid}/private/payment`).get()).data();
  const seller = (await db.doc(`users/${data.sellerUid}`).get()).data();

  if (seller && sellerId && customer) {
    await charge({
      item,
      customer: {
        id: customer.stripeUserId,
        uid: data.customerUid
      },
      seller: {
        id: sellerId,
        email: seller.email,
        uid: seller.id
      }
    });
    return sendNotification({
      item,
      target: {
        email: seller.email,
        id: seller.id,
        fcmToken: seller.fcmToken,
        notification: seller.notification
      },
      dynamicTemplateData: item
    });
  } else {
    throw new Error('セラーが存在しません');
  }
});
