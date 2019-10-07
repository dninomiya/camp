import * as functions from 'firebase-functions';
import {
  db,
  addNotification,
  postActivity,
  addPointHelper
} from './utils';
import { addPointActivity } from './utils/add-point-activity';

const addRepositories = (repos: any, gid: string): Promise<any[]> => {
  return Promise.all(
    repos.map((repo: any) => {
      return db.doc(`repos/${repo.node_id}`).set({
        isActive: true,
        gid
      });
    })
  );
};

const removeRepositories = (repos: any): Promise<any[]> => {
  return Promise.all(
    repos.map((repo: any) => {
      return db.doc(`repos/${repo.node_id}`).delete();
    })
  );
};

const removeAllRepositories = async (gid: string): Promise<any[]> => {
  const repos = await db.collection('repos').where('gid', '==', gid).get();
  return Promise.all(
    repos.docs.map((doc) => {
      return doc.ref.delete();
    })
  );
};

export const githubWebhook = functions.https.onRequest(async (req, res) => {
  console.log(req.body);
  if (req.body.action === 'added') {
    console.log('リポジトリ追加');
    await addRepositories(
      req.body.repositories_added,
      req.body.sender.id
    );
  }
  if (req.body.action === 'created') {
    console.log('新規連携');
    await addRepositories(
      req.body.repositories,
      req.body.sender.id
    );
  }
  if (req.body.action === 'removed') {
    console.log('リポジトリ削除');
    await removeRepositories(req.body.repositories_removed);
  }
  if (req.body.action && req.body.action.match(/deleted|revoked/)) {
    console.log('連携解除、アプリ削除');
    await removeAllRepositories(req.body.sender.id);
  }
  if (req.body.repository) {
    console.log('コミット');
    const repo = req.body.repository;
    const { uid } = (await db
      .doc(`githubUsers/${repo.owner.id}`)
      .get()).data() as any;
    console.log(uid);

    const user = (await db.doc(`users/${uid}`).get()).data() as any;
    if (uid) {
      const addedPoint = await addPointHelper(uid, 10);
      await addNotification(uid, {
        title: `${repo.name}の開発を進めました`,
        url: repo.html_url,
        point: addedPoint
      });
      await addPointActivity(uid, {
        type: 'dev',
        totalPoint: user.point + addedPoint,
        addedPoint: addedPoint
      });
      await postActivity(`${user.name}が開発を進めました`);
    }
  }
  return res.send('success');
});
