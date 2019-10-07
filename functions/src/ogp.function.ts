import * as functions from 'firebase-functions';

const ogs = require('open-graph-scraper');

const fetchOGP = (url: string) => {
  return new Promise(resolve => {
    ogs({url})
      .then((result: any) => resolve(result))
      .catch(() => resolve(null))
  });
}

export const getOGP = functions.https.onCall((urls: string[]) => {
  return Promise.all(urls.map(url => fetchOGP(url)));
})
