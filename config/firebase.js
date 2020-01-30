module.exports = env =>
  env === 'production'
    ? {
        apiKey: 'AIzaSyDaAc0fidGbSIDqO_3PamEB2InvHrbjEzM',
        authDomain: 'liturgymaker.firebaseapp.com',
        databaseURL: 'https://liturgymaker.firebaseio.com',
        projectId: 'liturgymaker',
        storageBucket: 'liturgymaker.appspot.com',
        messagingSenderId: '11008976132',
        appId: '1:11008976132:web:3ca8ade821d6d939',
      }
    : {
        apiKey: 'AIzaSyAJ-w9_OalrXE-dfARVf-pzf-tzA-wK1cE',
        authDomain: 'liturgymaker-dev.firebaseapp.com',
        databaseURL: 'https://liturgymaker-dev.firebaseio.com',
        projectId: 'liturgymaker-dev',
        storageBucket: 'liturgymaker-dev.appspot.com',
        messagingSenderId: '65726334205',
        appId: '1:65726334205:web:a178971483ea8fa1',
      };
