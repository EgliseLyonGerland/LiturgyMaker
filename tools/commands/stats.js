const { readFileSync } = require('fs');
const noop = require('lodash/noop');
const sortBy = require('lodash/sortBy');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const googleServiceCreds = require('../config/~egliselyongerland-642b3dfa5d11.json');
const open = require('open');

module.exports.command = `stats <command>`;
module.exports.desc = 'Display stats';

const backupDir = `${__dirname}/../../.firebase/backup`;

async function songsCommand({ update }) {
  let liturgies = JSON.parse(readFileSync(`${backupDir}/liturgies.json`));
  let songs = JSON.parse(readFileSync(`${backupDir}/songs.json`));

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

      const items = liturgy.version > 5 ? block.data.items : block.data;

      items.forEach(({ id }) => {
        if (id) {
          stats[id].count += 1;
        }
      });
    });
  });

  const doc = new GoogleSpreadsheet(
    '16KvjnOV9mygprQv1X47jrJ-jgfJQ9f2pXuA3CJA6Iig',
  );

  await doc.useServiceAccountAuth(googleServiceCreds);
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle.Chants;

  await sheet.clear();
  await sheet.setHeaderRow(['Titre', 'Compteur']);
  await sheet.addRows(
    sortBy(stats, 'count')
      .reverse()
      .map((row) => ({ Titre: row.title, Compteur: row.count })),
  );

  await sheet.loadCells('B1:B1');

  const b1 = sheet.getCell(0, 1);
  b1.note = `Calculé sur les ${liturgies.length} derniers cultes`;

  await sheet.saveUpdatedCells();

  open(
    `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit#gid=0`,
  );
}

module.exports.builder = function builder(yargs) {
  yargs.command('songs', 'Display stats about songs', noop, songsCommand);
};
