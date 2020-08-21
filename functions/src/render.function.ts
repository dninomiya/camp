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
  const id = req.query.v;
  if (req.useragent.isBot && id) {
    const lesson = (
      await db.doc(`lessons/${id.replace('/', '')}`).get()
    )?.data();
    const content = (
      await db.doc(`lessons/${req.query.v}/body/content`).get()
    )?.data() as { body: string };
    if (lesson && content) {
      res
        .set('Cache-Control', 'public, max-age=30000')
        .send(buildHtml({ ...lesson, body: content.body }));
      return;
    }
  }

  res.set('Cache-Control', 'public, max-age=3000').send(file);
});

export const render = functions.https.onRequest(app);
