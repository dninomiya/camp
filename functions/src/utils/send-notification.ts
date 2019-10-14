import { sendFCM } from './fcm';
import { sendEmail } from './sendgrid';
import { MailTemplate } from '../interfaces';
import { db, TimeStamp } from "./db";
const uuidv1 = require('uuid/v1');

export const sendNotification = async (params: {
  item: {
    path: string;
    title: string;
    body: string;
    type: MailTemplate;
  },
  target: {
    email: string;
    id: string;
    fcmToken: string;
    notification: {
      purchase?: boolean;
      reply?: boolean;
    }
  }
  dynamicTemplateData?: any;
}) => {
  const { item, target, dynamicTemplateData } = params;

  let canMail = false;

  if (target.notification) {
    if (target.notification.purchase && item.type.match(/open|charged/)) {
      canMail = true;
    } else if (target.notification.reply && !item.type.match(/open|charged/)) {
      canMail = true;
    }
  }

  if (canMail) {
    await sendEmail({
      to: target.email,
      templateId: item.type,
      dynamicTemplateData
    });
  }

  if (target.fcmToken) {
    await sendFCM({
      token: target.fcmToken,
      notification: {
        title: item.title,
        body: item.body.slice(0, 20),
        click_action: item.path
      }
    });
  }

  const id = uuidv1();
  return db.doc(`users/${target.id}/notifications/${id}`).set({
    id,
    createdAt: TimeStamp.now(),
    isRead: false,
    title: item.title,
    path: item.path
  });
}
