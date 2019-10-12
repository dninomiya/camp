import * as functions from 'firebase-functions';
import * as request from 'request';
import { db } from './utils';

const clientId = '45622d0c9345317a2482c24ecbdc9f3552eda034';
const clientSecret = 'EIpT+LS5j1ioGaFWINFiVKBw7S1KYsyq68o6C+8r1zjIk2rqBAjA4g15iY/l0j2wAtTlooInbVwiTzIEZcs/ZsRLFhcBG+5bK0VzSqT96jVTLhjjSCGOHL8Yyed8LDrL';

export const connectVimeo = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error('認証エラー');
  }

  const token = await new Promise((resolve, reject) => {
    request.post({
      url: 'https://api.vimeo.com/oauth/access_token',
      headers: {
        Authorization: btoa(`${clientId}:${clientSecret}`),
        'Content-Type': 'application/json',
        Accept: 'application/vnd.vimeo.*+json;version=3.4'
      },
      body: {
        code: data.code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:4200/connect-vimeo'
      }
    }, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        const result = JSON.parse(body);
        resolve(result.access_token);
      } else {
        reject(error);
      }
    });
  });

  return db.doc(`users/${context.auth.uid}/private/vimeo`).set({
    token
  });
});
