import * as functions from 'firebase-functions';
import { db } from './utils';
import { UserRecord } from 'firebase-functions/lib/providers/auth';

const createChannel = (user: UserRecord) => {
  const channelMeta = {
    id: user.uid,
    contact: user.email,
    authorId: user.uid,
    title: user.displayName + 'チャンネル',
    coverURL: '',
    avatarURL: user.photoURL,
    createdAt: new Date(),
    followerCount: 0,
    lessonCount: 0,
    email: user.email,
    unreadThread: {
      open: 0,
      closed: 0,
      request: 0
    }
  }
  return db.doc(`channels/${user.uid}`).set(channelMeta);
}

const createAccount = (user: UserRecord) => {
  return db.doc(`users/${user.uid}`).set({
    id: user.uid,
    name: user.displayName,
    email: user.email,
    avatarURL: user.photoURL,
    createdAt: new Date(),
    mailSettings: {
      forum: true,
      premium: true,
    }
  });
}

export const createUser = functions.auth.user().onCreate(async (user) => {
  await createAccount(user);
  await createChannel(user);
});
