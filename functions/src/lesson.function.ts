import { sendSlack } from './utils/slack';
import { firestore } from 'firebase-admin';
import * as functions from 'firebase-functions';
import { db, countUp, countDown } from './utils';
import { addIndex, updateIndex, removeIndex } from './utils/algolia';

const slackURL =
  'https://hooks.slack.com/services/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';

export const createLessonMeta = functions
  .region('asia-northeast1')
  .firestore.document('lessons/{lessonId}')
  .onCreate(async (snap, context) => {
    const meta = snap.data();

    if (meta) {
      if (meta.channelId) {
        await countUp(`channels/${meta.channelId}`, 'statistics.lessonCount');
      }

      if (meta.public) {
        await countUp(
          `channels/${meta.channelId}`,
          'statistics.publicLessonCount'
        );
      }

      const userDoc = db.doc(`users/${meta.authorId}`);
      const user = (await userDoc.get()).data();

      await userDoc.update({
        point: firestore.FieldValue.increment(10),
      });

      if (user) {
        sendSlack(slackURL, {
          text: `${user.name}が「${
            meta.title
          }」を投稿して**10P**獲得しました！👏👏👏\n${
            functions.config().host.url
          }v=${meta.id}`,
        });
      }
    }
  });

export const updateLessonMeta = functions
  .region('asia-northeast1')
  .firestore.document('lessons/{lessonId}')
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
        await countDown(
          `channels/${after.channelId}`,
          'statistics.lessonCount'
        );
        if (before.public) {
          await countDown(
            `channels/${after.channelId}`,
            'statistics.publicLessonCount'
          );
        }
      }
      return removeIndex(context.params.lessonId);
    } else {
      if (!before.public && after.public) {
        await countUp(
          `channels/${before.channelId}`,
          'statistics.publicLessonCount'
        );
      } else if (!after.public && before.public) {
        await countDown(
          `channels/${before.channelId}`,
          'statistics.publicLessonCount'
        );
      }

      const content = (
        await db.doc(`lessons/${before.id}/body/content`).get()
      ).data() as any;

      return updateIndex({
        ...after,
        body: content.body,
      });
    }
  });

export const createLesson = functions
  .region('asia-northeast1')
  .firestore.document('lessons/{lessonId}/body/content')
  .onCreate(async (snap, context) => {
    const lid = context.params.lessonId;
    const meta = (await db.doc(`lessons/${lid}`).get()).data() as any;
    const data = snap.data();
    const body = {
      ...meta,
      ...data,
    };
    return addIndex(body);
  });

export const deleteLesson = functions
  .region('asia-northeast1')
  .firestore.document('lessons/{lessonId}')
  .onDelete(async (snapshot, context) => {
    const lesson = snapshot.data();

    if (!lesson) {
      throw new Error('データが不正です');
    }

    if (lesson.public) {
      await countDown(
        `channels/${lesson.channelId}`,
        'statistics.publicLessonCount'
      );
    }

    const userDoc = db.doc(`users/${lesson.authorId}`);
    await userDoc.update({
      point: firestore.FieldValue.increment(-10),
    });

    await countDown(`channels/${lesson.channelId}`, 'statistics.lessonCount');
    return removeIndex(lesson.id);
  });

export const likeLesson = functions
  .region('asia-northeast1')
  .firestore.document('channels/{uid}/likes/{lessonId}')
  .onCreate(async (snapshot, context) => {
    const lessonDoc = db.doc(`lessons/${context.params.lessonId}`);

    await lessonDoc.update({
      likedCount: firestore.FieldValue.increment(1),
    });

    const userDoc = db.doc(`users/${context.params.uid}`);

    await userDoc.update({
      point: firestore.FieldValue.increment(100),
    });

    const user = (await userDoc.get()).data();
    const lesson = (await lessonDoc.get()).data();

    if (user && lesson) {
      return sendSlack(slackURL, {
        text: `${user.name}の「${
          lesson.title
        }」が感謝され、100P獲得しました！👏👏👏\n${
          functions.config().host.url
        }?v=${lesson.id}`,
      });
    }
  });

export const unLikeLesson = functions
  .region('asia-northeast1')
  .firestore.document('channels/{uid}/likes/{lessonId}')
  .onDelete(async (snapshot, context) => {
    await db.doc(`lessons/${context.params.lessonId}`).update({
      likedCount: firestore.FieldValue.increment(-1),
    });

    return db.doc(`users/${context.params.uid}`).update({
      point: firestore.FieldValue.increment(-100),
    });
  });
