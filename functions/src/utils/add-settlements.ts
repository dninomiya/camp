import { db } from './db';

export const addSettlement = (data: {
  id: string;
  userId: string;
  title?: string;
  path: string;
  sellerEmail: string;
  amount: number;
}) => {
  return db.doc(`users/${data.userId}/settlements/${data.id}`).set({
    id: data.id,
    ...data,
    createdAt: new Date()
  });
}
