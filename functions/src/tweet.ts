import * as functions from 'firebase-functions';
import * as Twitter from 'twitter';
import { db, addNotification, addPointHelper } from './utils';
import { config } from './config';
import { addPointActivity } from './utils/add-point-activity';

export const tweetLog = functions.https.onCall(async (data, context) => {
  const twitterData = (await db
    .doc(`users/${data.uid}/private/twitter`)
    .get()).data();
  if (twitterData) {
    const twitterClient = new Twitter({
      consumer_key: functions.config().twitter.consumer_key,
      consumer_secret: functions.config().twitter.consumer_secret,
      access_token_key: twitterData.accessToken,
      access_token_secret: twitterData.secret
    });
    await twitterClient.post('statuses/update', {
      status: data.body + config.tweetTemplate
    });
    const addedPoint = await addPointHelper(
      data.uid,
      10
    );
    const user = await db.doc(`users/${data.uid}`).get();

    await addPointActivity(data.uid, {
      type: 'tweet',
      totalPoint: (user.data() as any).point,
      addedPoint: addedPoint,
    });

    await addNotification(data.uid, {
      title: 'ログを行いました',
      point: addedPoint
    });

    return addedPoint;
  } else {
    throw new Error('認証に失敗しました');
  }
});
