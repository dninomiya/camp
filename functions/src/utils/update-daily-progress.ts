import * as moment from 'moment';
import { TimeStamp, db } from './db';
import { config } from '../config';

const DAILY_POINT_LIMIT = config.dailyPointLimit;

export const updateDailyProgress = async (uid: string, point: number): Promise<number> => {
  const user = (await db.doc(`users/${uid}`).get()).data();

  if (!user) {
    throw new Error('checkAndResetStamina: ユーザーが存在しません');
  }

  const reseted = user.lastResetGoalAt;

  if (!reseted || moment().diff(moment(reseted.toDate()), 'days') > 0) {
    await db.doc(`users/${uid}`).update({
      pointInToday: Math.min(DAILY_POINT_LIMIT, point),
      lastResetGoalAt: TimeStamp.now()
    });
    return  Math.min(DAILY_POINT_LIMIT, point);
  } else {
    const addedPoint = Math.min(DAILY_POINT_LIMIT - user.pointInToday, point);
    await db.doc(`users/${uid}`).update({
      pointInToday: user.pointInToday + addedPoint,
    });
    return addedPoint;
  }
};
