// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title: 'Flock',
  hostChannel: 'eX5RTeZF9Iape0Se9iPXlIwaU273',
  stripe: {
    publicKey: 'pk_test_lKq5jlH5mdbAxDeBfB4f0sn400ZYUYdpvH',
    clientId: 'ca_G18JYjlRlMAVsLJftLeRGhV6Z3jMXRcQ',
    campaignCoupon: 'BbFMNqOS',
  },
  firebase: {
    apiKey: 'AIzaSyD4MlPYXXp9_bjLsGmgzGlRYTSrKUTCqzY',
    authDomain: 'dev-update.firebaseapp.com',
    databaseURL: 'https://dev-update.firebaseio.com',
    projectId: 'dev-update',
    storageBucket: 'dev-update.appspot.com',
    messagingSenderId: '11098690567',
    appId: '1:11098690567:web:50dbe85f0c81793b',
    measurementId: 'G-KZGHYXETCB',
  },
  algolia: {
    appId: 'JDCC4O77OA',
    apiKey: '01e9b4a6c9c76f20959c97816a0b8e73',
    indexName: 'lessons',
  },
  captchaKey: '6LdxgLIUAAAAAG7VOix4btA1S51f5kYqPugCNPeu',
  host: 'https://dev-update.firebaseapp.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
