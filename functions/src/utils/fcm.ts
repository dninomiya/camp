import * as admin from 'firebase-admin';

export const sendFCM = (params: {
  token: string,
  notification: any
}) => {
  const message = {
    android: {
      ttl: 8000,
    },
    ...params
  };

  return admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}
