const firebase = require('firebase');
const { prompt } = require('inquirer');
const noop = require('lodash/noop');
const omitBy = require('lodash/omitBy');

const { parse, stringify } = require('../../src/utils/lyrics');

module.exports.command = `recitation <command>`;
module.exports.desc = 'Manage recitations';

const questions = [
  {
    name: 'title',
    type: 'string',
    message: 'Title',
    default: (title = null) => title,
  },
  {
    name: 'content',
    type: 'editor',
    message: 'Content',
    default: (content = []) =>
      stringify(
        content.map(({ text, italic = false }) => ({
          type: italic ? 'chorus' : 'verse',
          text,
        })),
      ),
  },
];

async function form(defaults = {}) {
  const answers = await prompt(
    questions.map((question) => ({
      ...question,
      default: question.default(defaults[question.name]),
    })),
  );

  answers.content = parse(answers.content);
  answers.content = answers.content.map(({ text, type }) => ({
    text,
    italic: type === 'chorus',
  }));

  return omitBy(answers, (answer) => !answer);
}

async function addCommand() {
  const data = await form();
  const db = firebase.firestore();

  await db.collection('recitations').add(data);

  console.log('Recitation added');
  process.exit();
}

async function updateCommand({ id }) {
  const db = firebase.firestore();

  const doc = await db.collection('recitations').doc(`${id}`).get();

  if (!doc.exists) {
    throw new Error(`Recitation ${id} not found`);
  }

  const data = await form(doc.data());

  await db.collection('recitations').doc(`${id}`).set(data);

  console.log('Recitation updated');
  process.exit();
}

module.exports.builder = function builder(yargs) {
  yargs
    .command('add', 'Add a recitation', noop, addCommand)
    .command('update <id>', 'Update a recitation', noop, updateCommand);
};
