import { db } from './db';
import * as admin from 'firebase-admin';

export const countUp = async (path: string, key: string, value = 1) => {
  try {
    const ref = db.doc(path);
    await ref.update(key, admin.firestore.FieldValue.increment(value));
  } catch (error) {
    console.log(path);
  }

  return;
};
