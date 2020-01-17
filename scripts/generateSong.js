const { prompt } = require('inquirer');
const omitBy = require('lodash/omitBy');
const firebase = require('firebase');
const firebaseConfig = require('../config/firebase');
const { parse } = require('../src/utils/lyrics');

require('firebase/auth');
require('firebase/firestore');

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const questions = [
  {
    name: 'title',
    type: 'string',
    message: 'Title',
  },
  {
    name: 'authors',
    type: 'string',
    message: 'Authors (separated by comma)',
  },
  {
    name: 'copyright',
    type: 'string',
    message: 'Copyright',
  },
  {
    name: 'collection',
    type: 'string',
    message: 'Collections (separated by comma)',
  },
  {
    name: 'transaltion',
    type: 'string',
    message: 'Translation',
  },
  {
    name: 'lyrics',
    type: 'editor',
    message: 'Lyrics',
  },
];

(async function main() {
  let answers = await prompt(questions);

  answers.lyrics = parse(answers.lyrics);
  answers = omitBy(answers, answer => !answer);

  const { email, password } = await prompt([
    { name: 'email', message: 'Email', default: 'oltodo@msn.com' },
    { name: 'password', message: 'Password', type: 'password' },
  ]);

  await firebase.auth().signInWithEmailAndPassword(email, password);
  await db.collection('songs').add(answers);

  process.exit();
})();
