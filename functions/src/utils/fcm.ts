import * as admin from 'firebase-admin';
import { config } from '../config';

export const sendFCM = (params: {
  token: string,
  notification: {
    title: string;
    body: string;
    click_action?: string;
  };
}) => {
  const message: any = {
    token: params.token,
    webpush: {
      notification: {
        ...params.notification,
        icon: config.host,
      }
    }
  };

  return admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}
