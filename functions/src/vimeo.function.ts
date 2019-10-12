import * as functions from 'firebase-functions';

const Vimeo = require('vimeo').Vimeo;

const client = new Vimeo(
  '45622d0c9345317a2482c24ecbdc9f3552eda034',
  'EIpT+LS5j1ioGaFWINFiVKBw7S1KYsyq68o6C+8r1zjIk2rqBAjA4g15iY/l0j2wAtTlooInbVwiTzIEZcs/ZsRLFhcBG+5bK0VzSqT96jVTLhjjSCGOHL8Yyed8LDrL',
  'a9f84bcdfeaab4ab297e001bc4faa79a'
);

export const connectVimeo = functions.https.onCall(() => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'GET',
      path: '/tutorial'
    }, function (error: any, body: any) {
      if (error) {
        reject(error);
      }

      resolve(body);
    })
  });
});
