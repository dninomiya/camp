import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const firebaseTools = require('firebase-tools');

admin.initializeApp(functions.config().firebase);
export const db = admin.firestore();
export const TimeStamp = admin.firestore.Timestamp;

export const checkAdmin = async (uid: string): Promise<boolean> => {
  const from = await db.doc(`users/${uid}`).get()
  const userData = from.data();
  return userData && userData.admin;
}

export const deleteAll = async (path: string): Promise<boolean> => {
  return firebaseTools.firestore.delete(path, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true,
    token: functions.config().fb.token
  });
}
