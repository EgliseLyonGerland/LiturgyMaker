const yargs = require('yargs');
const firebase = require('firebase');
const firebaseConfig = require('../config/firebase');

const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const songCommand = require('./commands/song');
const recitationCommand = require('./commands/recitation');
const blockCommand = require('./commands/block');
const statsCommand = require('./commands/stats');
const syncCommand = require('./commands/sync');

const config = require('./utils/config');

require('firebase/auth');
require('firebase/firestore');

// eslint-disable-next-line no-unused-expressions
yargs
  .middleware((argv) => {
    // eslint-disable-next-line no-param-reassign
    argv.env = argv.dev ? 'development' : 'production';

    config.setEnv(argv.env);
  })
  .middleware(({ env }) => {
    firebase.initializeApp(firebaseConfig);

    if (env === 'development') {
      firebase.auth().useEmulator('http://localhost:9099');
      firebase.firestore().useEmulator('localhost', 8080);
    }

    if (config.has('user')) {
      const data = JSON.parse(config.get('user'));
      const user = new firebase.User(data, data.stsTokenManager, data);
      firebase.auth().updateCurrentUser(user);
    }
  })
  .command(loginCommand)
  .command(logoutCommand)
  .command(songCommand)
  .command(recitationCommand)
  .command(blockCommand)
  .command(statsCommand)
  .command(syncCommand)
  .option('dev', {
    describe: 'Use development data',
    boolean: true,
    default: false,
  })
  .demandCommand()
  .recommendCommands()
  .strict()
  .help().argv;
