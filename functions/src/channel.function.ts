import * as functions from 'firebase-functions';
import { countUp, countDown, db } from './utils';

export const addLike = functions.firestore
  .document('channels/{cid}/likes/{lessonId}')
  .onCreate(async (snap, context) => {
    await countUp(`lessons/${context.params.lessonId}`, 'likeCount');
    const lesson = (await db.doc(`lessons/${context.params.lessonId}`).get()).data();
    if (lesson) {
      await countUp(`channels/${lesson.channelId}`, 'statistics.totalLikedCount');
    }
    return countUp(`channels/${context.params.cid}`, 'statistics.totalLikeCount');
  });

export const removeLike = functions.firestore
  .document('channels/{cid}/likes/{lessonId}')
  .onDelete(async (snap, context) => {
    await countDown(`lessons/${context.params.lessonId}`, 'likeCount');
    const lesson = (await db.doc(`lessons/${context.params.lessonId}`).get()).data();
    if (lesson) {
      await countDown(`channels/${lesson.channelId}`, 'statistics.totalLikedCount');
    }
    return countDown(`channels/${context.params.cid}`, 'statistics.totalLikeCount');
  });

export const follow = functions.firestore
  .document('channels/{cid}/followers/{uid}')
  .onCreate(async (snap, context) => {
    await db.doc(`channels/${context.params.uid}/follows/${context.params.cid}`).set({
      channelId: context.params.cid
    })
    return countUp(`channels/${context.params.cid}`, 'statistics.followerCount');
  });

export const unfollow = functions.firestore
  .document('channels/{cid}/followers/{uid}')
  .onDelete(async (snap, context) => {
    await db.doc(`channels/${context.params.uid}/follows/${context.params.cid}`).delete();
    return countDown(`channels/${context.params.cid}`, 'statistics.followerCount');
  });
