import * as functions from 'firebase-functions';
import { db } from '../utils';

export const pullRequest = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, resp) => {
    const data = req.body;
    const action = data.action;

    if (action !== 'opened') return;

    const repoId = data.repository.node_id;

    const user = (
      await db.collection('users').where('repoId', '==', repoId).get()
    ).docs[0];
    const userData = user ? user.data() : null;

    if (!userData) return;

    await db.doc(`users/${userData.id}`).update({
      lastPullRequestDate: new Date(),
    });

    resp.status(200).send(true);
  });
