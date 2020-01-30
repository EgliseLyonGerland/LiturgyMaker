const yargs = require('yargs');
const firebase = require('firebase');
const Configstore = require('configstore');

const config = new Configstore('liturgy-maker');
const firebaseConfig = require('../config/firebase');

const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const songCommand = require('./commands/song');
const recitationCommand = require('./commands/recitation');

require('firebase/auth');
require('firebase/firestore');

firebase.initializeApp(firebaseConfig);

if (config.has('user')) {
  const data = JSON.parse(config.get('user'));
  const user = new firebase.User(data, data.stsTokenManager, data);
  firebase.auth().updateCurrentUser(user);
}

// eslint-disable-next-line no-unused-expressions
yargs
  .command(loginCommand)
  .command(logoutCommand)
  .command(songCommand)
  .command(recitationCommand)
  .demandCommand()
  .recommendCommands()
  .strict()
  .help().argv;
