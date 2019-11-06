// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  title: 'エンジニアのゴミ箱（仮）',
  stripe: {
    publicKey: 'pk_test_lKq5jlH5mdbAxDeBfB4f0sn400ZYUYdpvH',
    clientId: 'ca_G18JYjlRlMAVsLJftLeRGhV6Z3jMXRcQ'
  },
  firebase: {
    apiKey: 'AIzaSyD4MlPYXXp9_bjLsGmgzGlRYTSrKUTCqzY',
    authDomain: 'dev-update.firebaseapp.com',
    databaseURL: 'https://dev-update.firebaseio.com',
    projectId: 'dev-update',
    storageBucket: 'dev-update.appspot.com',
    messagingSenderId: '11098690567',
    appId: '1:11098690567:web:50dbe85f0c81793b'
  },
  algolia: {
    appId: 'LZ4B1TI1NW',
    apiKey: 'e4a4e27ff57df999aae2dda4f3ad367d',
    indexName: 'lessons-dev'
  },
  captchaKey: '6LdxgLIUAAAAAG7VOix4btA1S51f5kYqPugCNPeu',
  host: 'https://dev-update.firebaseapp.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
