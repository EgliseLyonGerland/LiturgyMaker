const firebase = require('firebase');
const noop = require('lodash/noop');
const { prompt, Separator } = require('inquirer');
const uuid = require('uuid/v4');

module.exports.command = `block <command>`;
module.exports.desc = 'Manage blocks';

const blocksConfig = {
  announcements: {
    toString() {
      return 'Announcements';
    },
    createDefault() {
      return {
        title: 'Annonces',
        data: [],
      };
    },
  },
  reading: {
    toString({ title }) {
      return title;
    },
    prompt: [
      {
        name: 'title',
        message: 'Title',
      },
    ],
    createDefault({ title }) {
      return {
        title,
        data: {
          bibleRefs: [],
        },
      };
    },
  },
  recitation: {
    toString() {
      return 'Recitation';
    },
    createDefault() {
      return {
        title: 'Récitation',
        data: {
          id: null,
          infos: '',
        },
      };
    },
  },
  section: {
    toString({ data: { title } }) {
      return title;
    },
    prompt: [
      {
        name: 'title',
        message: 'Title',
      },
    ],
    createDefault({ title }) {
      return {
        data: { title },
      };
    },
  },
  sermon: {
    toString() {
      return 'Sermon';
    },
    createDefault() {
      return {
        title: 'Prédication',
        data: {
          title: '',
          author: '',
          bibleRefs: [],
          plan: [],
        },
      };
    },
  },
  songs: {
    toString({ data }) {
      return `Songs (${data.length})`;
    },
    createDefault() {
      return {
        data: [],
      };
    },
  },
};

function stringifyBlock(block) {
  return blocksConfig[block.type].toString(block);
}

async function addCommand({ liturgyId }) {
  const db = firebase.firestore();

  const doc = await db
    .collection('liturgies')
    .doc(`${liturgyId}`)
    .get();

  if (!doc.exists) {
    throw new Error(`Liturgy ${liturgyId} not found`);
  }

  const data = doc.data();

  const { index, blockType } = await prompt([
    {
      name: 'index',
      type: 'list',
      message: 'Select the location',
      pageSize: data.blocks.length * 2,
      choices: [
        ...data.blocks.reduce(
          (acc, block, idx) => [
            ...acc,
            { value: idx, name: '↪' },
            new Separator(` ${idx + 1} ${stringifyBlock(block)}`),
          ],
          [],
        ),
        { value: data.blocks.length, name: '↪' },
        new Separator('------------------------'),
      ],
    },
    {
      name: 'blockType',
      type: 'list',
      message: "Select the block's type",
      choices: Object.keys(blocksConfig),
    },
  ]);

  const blockConfig = blocksConfig[blockType];

  let values = {};
  if (blockConfig.prompt) {
    values = await prompt(blockConfig.prompt);
  }

  const block = {
    id: uuid(),
    type: blockType,
    ...blockConfig.createDefault(values),
  };

  const blocks = [...data.blocks];
  blocks.splice(index, 0, block);

  await db
    .collection('liturgies')
    .doc(`${liturgyId}`)
    .update({ blocks });

  console.log('Block added');
  process.exit();
}

module.exports.builder = function builder(yargs) {
  yargs.command('add <liturgy-id>', 'Add a block', noop, addCommand);
};
