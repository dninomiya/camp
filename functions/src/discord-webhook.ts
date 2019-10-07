import * as functions from 'firebase-functions';
import { db, addNotification, addPointHelper } from './utils';
import { addPointActivity } from './utils/add-point-activity';

export const discordWebHook = functions.https.onRequest(async (req, res) => {
  console.log(req.body);
  const points = await Promise.all(
    req.body.ids.map(async (id: string) => {
      const collections = await db
        .collection('users')
        .where('discord', '==', id)
        .get();
      if (collections.docs[0]) {
        const user = collections.docs[0].data();
        const uid = user.id;
        if (uid) {
          await addPointHelper(uid, 10);
          await addNotification(uid, {
            title: `Discordで貢献しました`,
            point: 10
          });
          await addPointActivity(uid, {
            type: 'help',
            totalPoint: user.point + 10,
            addedPoint: 10,
          });
        }
        return 10;
      }
      return null;
    })
  );
  res.send({ points });
});
