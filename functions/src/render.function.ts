const functions = require('firebase-functions');
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const url = require('url');

const useragent = require('express-useragent');

const generateUrl = (req: any) => {
  return url.format({
    protocol: 'https',
    host: functions.config().env.mode === 'prod' ? '3ml.app' : 'dev-update.firebaseapp.com',
    pathname: req.originalUrl
  });
};

const app = express();

app.use(express.static(__dirname + '/../hosting'));
app.use(useragent.express());

app.get('*', async (req: any, res: any) => {
  if (req.useragent.isBot) {
    const response = await fetch(
      `https://rendertron-255005.appspot.com/render/${generateUrl(req)}`
    );
    const body = await response.text();
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.set('Vary', 'User-Agent');
    res.send(body.toString());
  } else {
    res
      .status(200)
      .send(fs.readFileSync(__dirname + '/../hosting/index.html').toString());
  }
});

export const render = functions.https.onRequest(app);
