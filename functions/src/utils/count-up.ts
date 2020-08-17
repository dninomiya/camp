import { db } from './db';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const countUp = async (path: string, key: string, value = 1) => {
  try {
    const ref = db.doc(path);
    await ref.update(key, admin.firestore.FieldValue.increment(value));
  } catch (error) {
    functions.logger.info(path);
  }

  return;
};
