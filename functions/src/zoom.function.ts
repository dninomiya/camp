import * as functions from 'firebase-functions';
import { sendSlack } from './utils/slack';
import { sendDiscord } from './utils/discord';

const slackURL =
  'https://hooks.slack.com/services/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';
const discordURL =
  'https://discord.com/api/webhooks/805393253746343936/k0gHWCuT02zFzZ1HOXnst2Mmwkd40dW3xwJIGfg5BVc0bWNVETh1AGOH_EJVd8zb9bK0';

export const onRecordMeetingFromZoom = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res) => {
    const data = req.body.payload.object;

    if (data.topic.match('CAMP:')) {
      const message = [
        'MTGアーカイブです。1日で削除されます。外部公開は禁止です。',
        `PW: ${data.password}`,
        data.share_url,
      ].join('\n');

      await sendSlack(slackURL, {
        text: message,
      });

      await sendDiscord(discordURL, {
        content: message,
      });

      res.status(200).send(true);
    } else {
      res.status(200).send('not CAMP MTG');
    }
  });
