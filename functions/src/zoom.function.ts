import * as functions from 'firebase-functions';
import { sendSlack } from './utils/slack';

const slackURL =
  'https://hooks.slack.com/services/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';

export const onRecordMeetingFromZoom = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res) => {
    const data = req.body.payload.object;

    if (data.topic === 'CAMP MTG') {
      const message = [
        'MTGアーカイブです。1日で削除されます。外部公開は禁止です。',
        `PW: ${data.password}`,
        data.share_url,
      ].join('\n');

      await sendSlack(slackURL, {
        text: message,
      });

      res.status(200).send(true);
    } else {
      res.status(200).send('not CAMP MTG');
    }
  });
