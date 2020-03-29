import * as functions from 'firebase-functions';
import { db, sendEmail } from './utils';
import { UserRecord } from 'firebase-functions/lib/providers/auth';

const createChannel = (user: UserRecord) => {
  const channelMeta = {
    id: user.uid,
    contact: user.email,
    authorId: user.uid,
    title: user.displayName + 'のブートキャンプ',
    ownerName: user.displayName,
    coverURL: '',
    avatarURL: user.photoURL,
    createdAt: new Date(),
    email: user.email,
    listOrder: []
  };
  return db.doc(`channels/${user.uid}`).set(channelMeta);
};

const createAccount = (user: UserRecord) => {
  return db.doc(`users/${user.uid}`).set({
    id: user.uid,
    name: user.displayName,
    email: user.email,
    avatarURL: user.photoURL,
    createdAt: new Date(),
    trialUsed: false,
    plan: 'free',
    mailSettings: {
      purchase: true,
      reply: true
    }
  });
};

export const createUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async user => {
    await createAccount(user);
    await createChannel(user);
    if (user && user.email) {
      return sendEmail({
        to: user.email,
        templateId: 'register'
      });
    } else {
      return;
    }
  });
