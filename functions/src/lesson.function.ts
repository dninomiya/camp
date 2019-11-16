import * as functions from 'firebase-functions';
import { db, countUp, countDown } from './utils';
import { addIndex, updateIndex, removeIndex } from './utils/algolia';

export const createLessonMeta = functions.firestore
  .document('lessons/{lessonId}')
  .onCreate(async (snap, context) => {
    const meta = snap.data();

    if (meta) {
      if (meta.channelId) {
        await countUp(`channels/${meta.channelId}`, 'statistics.lessonCount');
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

    if (before.deleted) {
      return;
    }

    if (after.deleted) {
      if (after.channelId) {
        await countDown(`channels/${after.channelId}`, 'statistics.lessonCount');
        if (before.public) {
          await countDown(`channels/${after.channelId}`, 'statistics.publicLessonCount');
        }
      }
      return removeIndex(context.params.lessonId);
    } else {
      if (!before.public && after.public) {
        await countUp(`channels/${before.channelId}`, 'statistics.publicLessonCount');
      } else if (!after.public && before.public) {
        await countDown(`channels/${before.channelId}`, 'statistics.publicLessonCount');
      }

      const content = (await db.doc(`lessons/${before.id}/body/content`).get()).data() as any;

      return updateIndex({
        ...after,
        body: content.body
      });
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

export const deleteLesson = functions.firestore
  .document('lessons/{lessonId}')
  .onDelete(async (snapshot, context) => {
    const lesson = snapshot.data();

    if (!lesson) {
      throw new Error('データが不正です');
    }

    if (lesson.public) {
      await countDown(`channels/${lesson.channelId}`, 'statistics.publicLessonCount');
    }
    await countDown(`channels/${lesson.channelId}`, 'statistics.lessonCount');
    return removeIndex(lesson.id);
  });
