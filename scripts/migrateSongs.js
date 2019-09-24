const { prompt } = require('inquirer');
const firebase = require('firebase');
const firebaseConfig = require('../config/firebase');
const songs = require('../config/songs.json');

require('firebase/auth');
require('firebase/firestore');

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

(async function main() {
  const { email, password } = await prompt([
    { name: 'email', message: 'Email', default: 'oltodo@msn.com' },
    { name: 'password', message: 'Password', type: 'password' },
  ]);

  await firebase.auth().signInWithEmailAndPassword(email, password);

  await Promise.all(songs.map(song => db.collection('songs').add(song)));

  process.exit();
})();
