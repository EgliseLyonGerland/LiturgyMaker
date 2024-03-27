const { readFileSync } = require("fs");

const { format } = require("date-fns");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { uniq, reduce, map, sum, last } = require("lodash");
const open = require("open");
const { table } = require("table");

const googleServiceCreds = require("../config/~egliselyongerland-642b3dfa5d11.json");

module.exports.command = "stats <command>";
module.exports.desc = "Display stats";

const backupDir = `${__dirname}/../../.firebase/backup`;

async function songsCommand({ dryRun }) {
  const liturgies = JSON.parse(readFileSync(`${backupDir}/liturgies.json`));
  const songs = JSON.parse(readFileSync(`${backupDir}/songs.json`));

  const stats = songs.reduce(
    (acc, { id, title }) => ({
      ...acc,
      [id]: { title, count: {} },
    }),
    {},
  );

  liturgies.forEach((liturgy) => {
    const year = new Date(liturgy.date).getFullYear() + 0;

    liturgy.blocks.forEach((block) => {
      if (block.type !== "songs") {
        return;
      }

      const items = liturgy.version > 5 ? block.data.items : block.data;

      items.forEach(({ id }) => {
        if (!id) return;

        if (!(year in stats[id].count)) {
          stats[id].count[year] = 0;
        }

        stats[id].count[year] += 1;
      });
    });
  });

  const years = uniq(
    reduce(stats, (acc, curr) => acc.concat(Object.keys(curr.count)), []),
  );

  const header = ["Titre", ...years, "Total"];

  const values = map(stats, (item) => [
    item.title,
    ...years.map((year) => item.count[year] || 0),
    sum(Object.values(item.count)),
  ]).sort((a, b) => last(b) - last(a));

  if (dryRun) {
    console.log(table([header, ...values]));
    return;
  }

  const doc = new GoogleSpreadsheet(
    "16KvjnOV9mygprQv1X47jrJ-jgfJQ9f2pXuA3CJA6Iig",
  );

  await doc.useServiceAccountAuth(googleServiceCreds);
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle.Chants;

  await sheet.clear();
  await sheet.setHeaderRow(header);
  await sheet.addRows(values);
  await sheet.loadCells("A1:A1");

  const firstDate = new Date(liturgies[0].date);
  const lastDate = new Date(liturgies[liturgies.length - 1].date);
  const b1 = sheet.getCell(0, 0);
  b1.note = `Calculé sur les ${liturgies.length} cultes du ${format(
    firstDate,
    "dd/MM/yyyy",
  )} au ${format(lastDate, "dd/MM/yyyy")}`;

  await sheet.saveUpdatedCells();

  open(
    `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit#gid=0`,
  );
}

module.exports.builder = function builder(yargs) {
  yargs.command(
    "songs",
    "Display stats about songs",
    (y) => {
      y.option("dry-run", { type: "boolean", default: false });
    },
    songsCommand,
  );
};
