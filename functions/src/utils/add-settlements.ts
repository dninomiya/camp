import { db } from './db';

export const addSettlement = async (data: {
  userId: string;
  title?: string;
  amount: number;
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
  pdf: string;
}) => {
  await db.doc(`users/${data.userId}`).update({
    currentPeriodStart: data.currentPeriodStart,
    currentPeriodEnd: data.currentPeriodEnd
  });

  return db.collection(`users/${data.userId}/settlements`).add({
    ...data,
    createdAt: new Date()
  });
};
