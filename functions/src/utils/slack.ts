const request = require('request');

export const sendSlack = (
  uri: string,
  json: {
    text: string;
  }
) => {
  return request.post({
    uri,
    headers: { 'Content-type': 'application/json' },
    json,
  });
};
