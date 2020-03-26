const functions = require('firebase-functions');
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const useragent = require('express-useragent');

const appUrl =
  functions.config().env.mode === 'prod'
    ? 'to.camp'
    : 'dev-update.firebaseapp.com';

const generateUrl = (req: any) => {
  return url.format({
    protocol: 'https',
    host: appUrl,
    pathname: req.originalUrl
  });
};

const app = express();

app.use(useragent.express());

app.get('*', async (req: any, res: any) => {
  if (req.useragent.isBot) {
    const response = await fetch(
      `https://rendertron-255005.appspot.com/render/${generateUrl(req)}`
    );
    const body = await response.text();
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.set('Vary', 'User-Agent');
    res.send(body.toString());
  } else {
    fetch(`https://${appUrl}`)
      .then((result: any) => result.text())
      .then((body: any) => {
        res.send(body.toString());
      });
  }
});

export const render = functions.https.onRequest(app);
