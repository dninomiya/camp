import { sendSlack } from './../utils/slack';
import { firestore } from 'firebase-admin';
import { db } from '../utils/db';
import * as functions from 'firebase-functions';

export const getBestAnswer = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, resp) => {
    const githubId = req.body.githubId;
    const issueId = req.body.issueId;
    const commentId = req.body.commentId;

    const doc = (
      await db
        .collectionGroup('private')
        .where('githubUniqueId', '==', +githubId)
        .get()
    ).docs[0];

    if (!doc) {
      resp.status(500).send('ユーザーが存在しません。');
    } else {
      const uid = doc.ref.parent?.parent?.id;

      if (uid) {
        await db.doc(`bestAnswers/${issueId}`).set({
          createdAt: new Date(),
          commentId,
          issueId,
          uid,
        });
      }

      resp.status(200).send(true);
    }
  });

export const sendBestAnswer = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, resp) => {
    const issueId = req.body.issueId;
    if (!issueId) {
      resp.status(200).end();
    }
    const data = (await db.doc(`bestAnswers/${issueId}`).get()).data();
    if (data) {
      resp.status(200).send(data.commentId);
    } else {
      resp.status(200).end();
    }
  });

export const onBestAnswer = functions
  .region('asia-northeast1')
  .firestore.document('bestAnswers/{issueId}')
  .onCreate(async (snap) => {
    const data = snap.data();

    if (data) {
      const userDoc = db.doc(`users/${data.uid}`);
      await userDoc.update({
        point: firestore.FieldValue.increment(100),
      });
      const user: any = (await userDoc.get()).data();

      return sendSlack(
        'https://hooks.slack.com/services/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',
        {
          text: `${user.name}がベストアンサーで100P獲得しました！\nhttps://github.com/camp-team/camp-team/issues/${data.issueId}`,
        }
      );
    } else {
      return;
    }
  });
