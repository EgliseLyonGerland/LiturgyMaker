const yargs = require('yargs');
const firebase = require('firebase');
const Configstore = require('configstore');
const createFirebaseConfig = require('../config/firebase');

const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const songCommand = require('./commands/song');
const recitationCommand = require('./commands/recitation');

const config = new Configstore('liturgy-maker');

require('firebase/auth');
require('firebase/firestore');

// eslint-disable-next-line no-unused-expressions
yargs
  .middleware(argv => {
    // eslint-disable-next-line no-param-reassign
    argv.env = argv.prod ? 'production' : 'development';
  })
  .middleware(({ env }) => {
    firebase.initializeApp(createFirebaseConfig(env));

    if (config.has(`${env}.user`)) {
      const data = JSON.parse(config.get(`${env}.user`));
      const user = new firebase.User(data, data.stsTokenManager, data);
      firebase.auth().updateCurrentUser(user);
    }
  })
  .command(loginCommand)
  .command(logoutCommand)
  .command(songCommand)
  .command(recitationCommand)
  .option('prod', {
    describe: 'Use production data',
    boolean: true,
    default: false,
  })
  .demandCommand()
  .recommendCommands()
  .strict()
  .help().argv;
