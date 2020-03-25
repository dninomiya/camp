// import * as functions from 'firebase-functions';
// import { db } from './utils';

// export const addLessonToList = functions.region('asia-northeast1').firestore
//   .document('lists/{{listId}}/lessons/{{lessonId}}').onCreate((user) => {
//   const channelMeta = {
//     id: user.uid,
//     authorId: user.uid,
//     title: user.displayName + 'チャンネル',
//     coverURL: '',
//     avatarURL: user.photoURL,
//     subscriberCount: 0,
//     createdAt: new Date()
//   }
//   return db.doc(`channels/${user.uid}`).set(channelMeta);
// });

// export const deleteChannel = functions.auth.user().onDelete((user) => {
//   return db.doc(`channels/${user.uid}`).delete();
// });
