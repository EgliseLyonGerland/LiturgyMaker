const yargs = require('yargs');
const firebase = require('firebase');
const createFirebaseConfig = require('../config/firebase');

const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const songCommand = require('./commands/song');
const recitationCommand = require('./commands/recitation');
const blockCommand = require('./commands/block');
const statsCommand = require('./commands/stats');

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
    firebase.initializeApp(createFirebaseConfig(env));

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
  .option('dev', {
    describe: 'Use development data',
    boolean: true,
    default: false,
  })
  .demandCommand()
  .recommendCommands()
  .strict()
  .help().argv;
