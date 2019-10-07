import { db } from './db';
import * as admin from 'firebase-admin';

export const countUp = (path: string, key: string, value=1) => {
  const ref = db.doc(path);
  return ref.update(key, admin.firestore.FieldValue.increment(value));
};
