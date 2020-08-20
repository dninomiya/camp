import * as functions from 'firebase-functions';
import * as express from 'express';
import * as useragent from 'express-useragent';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { db } from './utils/db';

const file = readFileSync(resolve(__dirname, 'index.html'), {
  encoding: 'utf-8',
});

const appUrl =
  functions.config().env.mode === 'prod'
    ? 'to.camp'
    : 'dev-update.firebaseapp.com';

const replacer = (data: string) => {
  return (match: string, content: string): string => {
    return match.replace(content, data);
  };
};

const buildHtml = (lesson: { [key: string]: string }) => {
  return file
    .replace(
      /<meta name="description" content="(.+)" \/>/gm,
      replacer(lesson.body?.substr(0, 200).replace(/^#+ |^- /gm, ''))
    )
    .replace(/content="(.+ogp-cover.png)"/gm, replacer(lesson.thumbnailURL))
    .replace(/<title>(.+)<\/title>"/gm, replacer(lesson.title))
    .replace(
      /<meta property="og:title" content="(.+)" \/>"/gm,
      replacer(lesson.title)
    )
    .replace(
      /<meta property="og:url" content="(.+)" \/>/g,
      replacer(`https://${appUrl}/lesson?v=${lesson.id}`)
    );
};

const app = express();

app.use(useragent.express());

app.get('*', async (req: any, res: any) => {
  if (req.useragent.isBot && req.query.v) {
    functions.logger.info(req.query.v);
    const lesson = (await db.doc(`lessons/${req.query.v}`).get())?.data();
    const content = (
      await db.doc(`lessons/${req.query.v}/body/content`).get()
    )?.data() as { body: string };
    if (lesson && content) {
      functions.logger.info('build');
      res.send(buildHtml({ ...lesson, body: content.body }));
      return;
    } else {
      functions.logger.info('no action');
      res.send(file);
      return;
    }
  }

  functions.logger.info('no action');
  res.send(file);
});

export const render = functions.https.onRequest(app);
