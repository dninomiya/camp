import { db, TimeStamp } from './db';

export const addPointActivity = (uid: string, opt: {
  type: string,
  totalPoint: number,
  addedPoint: number
}): Promise<any> => {
  return db.collection(`users/${uid}/activities`).add({
    type: opt.type,
    totalPoint: opt.totalPoint,
    addedPoint: opt.addedPoint,
    date: TimeStamp.now()
  });
}
