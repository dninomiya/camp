import { countUp, updateDailyProgress, db } from './';

export const addPointHelper = async (uid: string, point: number) => {
  const addedPoint = await updateDailyProgress(uid, point);
  await db.doc(`users/${uid}`).update({
    lastActivity: new Date()
  });
  await countUp(`users/${uid}`, 'point', addedPoint);
  return addedPoint;
};
