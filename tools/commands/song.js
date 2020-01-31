const firebase = require('firebase');
const mapValues = require('lodash/mapValues');
const omitBy = require('lodash/omitBy');
const noop = require('lodash/noop');
const { prompt } = require('inquirer');
const { parse, stringify } = require('../../src/utils/lyrics');

module.exports.command = `song <command>`;
module.exports.desc = 'Manage songs';

const questions = [
  {
    name: 'title',
    type: 'string',
    message: 'Title',
    default: (title = null) => title,
  },
  {
    name: 'authors',
    type: 'string',
    message: 'Authors (separated by comma)',
    default: (authors = null) => authors,
  },
  {
    name: 'copyright',
    type: 'string',
    message: 'Copyright',
    default: (copyright = null) => copyright,
  },
  {
    name: 'collection',
    type: 'string',
    message: 'Collections (separated by comma)',
    default: (collection = null) => collection,
  },
  {
    name: 'transaltion',
    type: 'string',
    message: 'Translation',
    default: (transaltion = null) => transaltion,
  },
  {
    name: 'lyrics',
    type: 'editor',
    message: 'Lyrics',
    default: (lyrics = []) => stringify(lyrics),
  },
];

async function form(defaults = {}) {
  const answers = await prompt(
    questions.map(question => ({
      ...question,
      default: question.default(defaults[question.name]),
    })),
  );

  answers.lyrics = parse(answers.lyrics);

  return omitBy(
    mapValues(answers, answer => (answer.trim ? answer.trim() : answer)),
    answer => !answer,
  );
}

async function addCommand() {
  const data = await form();

  const db = firebase.firestore();

  await db.collection('songs').add(data);

  console.log('Song added');
  process.exit();
}

async function updateCommand({ id }) {
  const db = firebase.firestore();

  const doc = await db
    .collection('songs')
    .doc(`${id}`)
    .get();

  if (!doc.exists) {
    throw new Error(`Song ${id} not found`);
  }

  const data = await form(doc.data());

  await db
    .collection('songs')
    .doc(`${id}`)
    .set(data);

  console.log('Song updated');
  process.exit();
}

module.exports.builder = function builder(yargs) {
  yargs
    .command('add', 'Add a song', noop, addCommand)
    .command('update <id>', 'Update a song', noop, updateCommand);
};
