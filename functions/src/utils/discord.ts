const request = require('request');

export const sendDiscord = (
  uri: string,
  json: {
    content: string;
  }
) => {
  return request.post({
    uri,
    headers: { 'Content-type': 'application/json' },
    json,
  });
};
