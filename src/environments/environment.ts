// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAW12g5DBEYOlFfiMh-BIOxfgTfO6-FRcY',
    authDomain: 'rb-benefits.firebaseapp.com',
    databaseURL: 'https://rb-benefits.firebaseio.com',
    projectId: 'rb-benefits',
    storageBucket: 'rb-benefits.appspot.com',
    messagingSenderId: '994878903595'
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
