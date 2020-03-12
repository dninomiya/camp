import { db } from './db';

export const addSettlement = (data: {
  userId: string;
  title?: string;
  amount: number;
}) => {
  return db.collection(`users/${data.userId}/settlements`).add({
    ...data,
    createdAt: new Date()
  });
}
