import * as functions from 'firebase-functions';
import { db, countUp, countDown } from './utils';
import { addIndex, updateIndex, removeIndex } from './utils/algolia';

export const createLessonMeta = functions.firestore
  .document('lessons/{lessonId}')
  .onCreate(async (snap, context) => {
    const meta = snap.data();

    if (meta) {
      if (meta.channelId) {
        await countUp(`channels/${meta.channelId}`, 'lessonCount');
      }

      if (meta.public) {
        await countUp(`channels/${meta.channelId}`, 'statistics.publicLessonCount');
      }
    }
  });

export const updateLessonMeta = functions.firestore
  .document('lessons/{lessonId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before || !after) {
      throw new Error('データが存在しません');
    }

    if (after.deleted) {
      await countDown(`channels/${after.channelId}`, 'lessonCount');
      await countDown(`channels/${after.channelId}`, 'statistics.publicLessonCount');
      return removeIndex(context.params.lessonId);
    } else {
      if (!before.public && after.public) {
        await countUp(`channels/${before.channelId}`, 'statistics.publicLessonCount');
      } else if (!after.public && before.public) {
        await countDown(`channels/${before.channelId}`, 'statistics.publicLessonCount');
      }

      return updateIndex(after);
    }
  });

export const createLesson = functions.firestore
  .document('lessons/{lessonId}/body/content')
  .onCreate(async (snap, context) => {
    const lid = context.params.lessonId;
    const meta = (await db.doc(`lessons/${lid}`).get()).data() as any;
    const data = snap.data();
    const body = {
      ...meta,
      ...data
    };
    return addIndex(body);
  });

export const updateLesson = functions.firestore
  .document('lessons/{lessonId}/body/content')
  .onUpdate(async (change, context) => {
    const lid = context.params.lessonId;
    const meta = (await db.doc(`lessons/${lid}`).get()).data() as any;
    const data = change.after.data() as any;
    const body = {
      ...meta,
      ...data
    };

    return updateIndex(body);
  });
