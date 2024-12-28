import { readFileSync } from 'node:fs'

import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { format } from 'date-fns'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { last, map, reduce, sum, uniq } from 'lodash-es'
import open from 'open'
import { table } from 'table'
import { JWT } from 'google-auth-library'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const command = 'stats <command>'
export const desc = 'Display stats'

const backupDir = path.join(__dirname, '../../.firebase/backup')

const creds = JSON.parse(
  readFileSync(path.join(__dirname, '../../config/~egliselyongerland-642b3dfa5d11.json')),
)

async function songsCommand({ dryRun }) {
  const liturgies = JSON.parse(readFileSync(`${backupDir}/liturgies.json`))
  const songs = JSON.parse(readFileSync(`${backupDir}/songs.json`))

  const stats = songs.reduce(
    (acc, { id, title }) => ({
      ...acc,
      [id]: { title, count: {} },
    }),
    {},
  )

  liturgies.forEach((liturgy) => {
    const date = new Date(liturgy.date)

    if (date.getDay() !== 0) {
      return
    }

    const year = date.getFullYear() + 0

    liturgy.blocks.forEach((block) => {
      if (block.type !== 'songs') {
        return
      }

      const items = liturgy.version > 5 ? block.data.items : block.data

      items.forEach(({ id }) => {
        if (!id)
          return

        if (!(year in stats[id].count)) {
          stats[id].count[year] = 0
        }

        stats[id].count[year] += 1
      })
    })
  })

  const years = uniq(
    reduce(stats, (acc, curr) => acc.concat(Object.keys(curr.count)), []),
  )

  const header = ['Titre', ...years, 'Total']

  const values = map(stats, item => [
    item.title,
    ...years.map(year => item.count[year] || 0),
    sum(Object.values(item.count)),
  ]).sort((a, b) => last(b) - last(a))

  if (dryRun) {
    console.log(table([header, ...values]))
    return
  }

  const auth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })

  const doc = new GoogleSpreadsheet(
    '16KvjnOV9mygprQv1X47jrJ-jgfJQ9f2pXuA3CJA6Iig',
    auth,
  )

  await doc.loadInfo()

  const sheet = doc.sheetsByTitle.Chants

  await sheet.clear()
  await sheet.setHeaderRow(header)
  await sheet.addRows(values)
  await sheet.loadCells('A1:A1')

  const firstDate = new Date(liturgies[0].date)

  const lastDate = new Date(liturgies[liturgies.length - 1].date)
  const b1 = sheet.getCell(0, 0)
  b1.note = `Calculé sur les ${liturgies.length} cultes du ${format(
    firstDate,
    'dd/MM/yyyy',
  )} au ${format(lastDate, 'dd/MM/yyyy')}`

  await sheet.saveUpdatedCells()

  open(
    `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit#gid=0`,
  )
}

export const builder = function builder(yargs) {
  yargs.command(
    'songs',
    'Display stats about songs',
    (y) => {
      y.option('dry-run', { type: 'boolean', default: false })
    },
    songsCommand,
  )
}
