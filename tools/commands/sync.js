const { writeFileSync, mkdirSync, readFileSync } = require('fs');
const firebase = require('firebase');
const noop = require('lodash/noop');
const { prompt } = require('inquirer');

module.exports.command = `sync <command>`;
module.exports.desc = 'Sync data';

const collections = ['liturgies', 'songs', 'recitations'];
const backupDir = `${__dirname}/../../.firebase/backup`;

async function confirm(message) {
  return (
    await prompt([
      {
        name: 'ok',
        message,
        type: 'confirm',
        default: false,
      },
    ])
  ).ok;
}

async function backupCommand() {
  const db = firebase.firestore();

  await Promise.all(
    collections.map(async (name) => {
      const { docs } = await db.collection(name).get();

      const data = docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      mkdirSync(backupDir, { recursive: true });

      writeFileSync(`${backupDir}/${name}.json`, JSON.stringify(data));

      console.log(`Collection "${name}" backuped`);
    }),
  );

  console.log('Done');
  process.exit();
}

async function restoreCommand({ env }) {
  if (
    env === 'production' &&
    !(await confirm(
      'Are you sure you want to restore data on production database?',
    ))
  ) {
    console.log('Aborted');
    process.exit();
  }

  const db = firebase.firestore();

  await Promise.all(
    collections.map((name) => {
      const doc = readFileSync(`${backupDir}/${name}.json`);
      const items = JSON.parse(doc);

      return Promise.all(
        items.map(({ id, ...data }) => {
          return db.collection(name).doc(id).set(data);
        }),
      ).then(() => {
        console.log(`Collection "${name}" restored`);
      });
    }),
  );

  console.log('Done');
  process.exit();
}

module.exports.builder = function builder(yargs) {
  yargs.command('backup', 'backup data', noop, backupCommand);
  yargs.command('restore', 'Restore backup data', noop, restoreCommand);
};
