import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path, { dirname } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import prompt from 'inquirer'
import ora from 'ora'
import firebaseAdmin from 'firebase-admin'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const command = 'sync <command>'
export const desc = 'Sync data'

const collections = ['users']
const backupDir = path.join(__dirname, '../../.firebase/backup')

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
  ).ok
}

async function backupCommand() {
  const db = firebaseAdmin.firestore()

  await collections.reduce(
    (p, name) =>
      p.then(async () => {
        const spinner = ora(`Collection "${name}"`).start()

        const { docs } = await db.collection(name).get()

        const data = docs.map(doc => ({ id: doc.id, ...doc.data() }))

        mkdirSync(backupDir, { recursive: true })

        writeFileSync(`${backupDir}/${name}.json`, JSON.stringify(data))

        spinner.succeed()
      }),
    Promise.resolve(),
  )

  process.exit()
}

async function restoreCommand({ env }) {
  if (
    env === 'production'
    && !(await confirm(
      'Are you sure you want to restore data on production database?',
    ))
  ) {
    console.log('Aborted')
    process.exit()
  }

  const db = firebaseAdmin.firestore()

  await Promise.all(
    collections.map((name) => {
      const doc = readFileSync(`${backupDir}/${name}.json`)
      const items = JSON.parse(doc)

      return Promise.all(
        items.map(({ id, ...data }) => {
          return db.collection(name).doc(id).set(data)
        }),
      ).then(() => {
        console.log(`Collection "${name}" restored`)
      })
    }),
  )

  console.log('Done')
  process.exit()
}

export const builder = function builder(yargs) {
  yargs.command('backup', 'backup data', () => {}, backupCommand)
  yargs.command('restore', 'Restore backup data', () => {}, restoreCommand)
}
