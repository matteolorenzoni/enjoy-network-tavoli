// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    projectId: 'enjoy-network-tavoli',
    appId: '1:682704062987:web:bfebc270cfdb2fd2e3550e',
    storageBucket: 'enjoy-network-tavoli.appspot.com',
    locationId: 'europe-west3',
    apiKey: 'AIzaSyAJ9uYDtGqbkj9UnU-Xe1alo2Bnvc_VIqQ',
    authDomain: 'enjoy-network-tavoli.firebaseapp.com',
    messagingSenderId: '682704062987',
    measurementId: 'G-4LWJ0DDBN5'
  },
  collection: {
    EMPLOYEES: 'employees',
    EVENTS: 'events',
    ASSIGNMENTS: 'assignments',
    TABLES: 'tables',
    PARTICIPATIONS: 'participations',
    CLIENTS: 'clients',
    ERRORS: 'errors'
  },
  defaultPassword: 'enjoynetwork',
  administratorUids: ['ehEkhUjgMWSr3kKyREniV4SvmXD3'],
  fidelityTables: ['0Juny0oBzfhUA0tYIdHM']
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
