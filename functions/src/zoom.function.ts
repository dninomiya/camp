import * as functions from 'firebase-functions';
const request = require('request');

const slackURL =
  'https://hooks.slack.com/services/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';

export const onRecordMeetingFromZoom = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res) => {
    const data = req.body.payload.object;

    if (data.topic === 'CAMP MTG') {
      const message = [
        'MTGアーカイブです。1日で削除されます。外部公開は禁止です。',
        data.share_url,
      ].join('\n');

      await request.post({
        uri: slackURL,
        headers: { 'Content-type': 'application/json' },
        json: { text: message },
      });

      res.status(200).send(true);
    }
  });
