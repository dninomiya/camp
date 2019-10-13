import { db, TimeStamp } from "./db";

export const addNotification = (
  uid: string,
  params: {
    title: string;
    url?: string;
  }
): Promise<any> => {
  const id = db.collection(`users/${uid}/notifications`).doc().id;
  return db.doc(`users/${uid}/notifications/${id}`).set({
    id,
    createdAt: TimeStamp.now(),
    isRead: false,
    ...params
  });
};
