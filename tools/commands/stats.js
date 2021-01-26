const firebase = require('firebase');
const noop = require('lodash/noop');
const sortBy = require('lodash/sortBy');
const chalk = require('chalk');
const Table = require('cli-table');
const config = require('../utils/config');

module.exports.command = `stats <command>`;
module.exports.desc = 'Display stats';

async function dumpLiturgies() {
  const db = firebase.firestore();
  const { docs } = await db.collection('liturgies').get();
  const liturgies = docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  config.set('dump.liturgies', liturgies);

  return liturgies;
}

async function dumpSongs() {
  const db = firebase.firestore();
  const { docs } = await db.collection('songs').get();
  const songs = docs.map((doc) => {
    const { title, authors, number } = doc.data();

    return { id: doc.id, title, authors, number };
  });

  config.set('dump.songs', songs);

  return songs;
}

async function songsCommand({ update }) {
  let liturgies = config.get('dump.liturgies');
  let songs = config.get('dump.songs');

  if (!liturgies || update) {
    liturgies = await dumpLiturgies();
  }
  if (!songs || update) {
    songs = await dumpSongs();
  }

  const stats = songs.reduce(
    (acc, { id, title }) => ({
      ...acc,
      [id]: { title, count: 0 },
    }),
    {},
  );

  liturgies.forEach((liturgy) => {
    liturgy.blocks.forEach((block) => {
      if (block.type !== 'songs') {
        return;
      }

      block.data.forEach(({ id }) => {
        if (id) {
          stats[id].count += 1;
        }
      });
    });
  });

  const table = new Table();

  sortBy(stats, 'count')
    .reverse()
    .forEach((row) => {
      table.push([row.title, chalk.yellow(row.count)]);
    });

  console.log(table.toString());
  console.log(liturgies.length);
  process.exit();
}

module.exports.builder = function builder(yargs) {
  yargs
    .command('songs', 'Display stats about songs', noop, songsCommand)
    .option('update', {
      describe: 'Update cache',
      boolean: true,
      default: false,
    });
};
