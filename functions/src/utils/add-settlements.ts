const uuidv1 = require('uuid/v1');
import { db } from './db';

export const addSettlement = (data: {
  userId: string;
  title?: string;
  path: string;
  sellerEmail: string;
  amount: number;
}) => {
  const id = uuidv1();
  return db.doc(`users/${data.userId}/settlements/${id}`).set({
    id,
    ...data,
    createdAt: new Date()
  });
}
