import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import firebaseAdmin from 'firebase-admin'

import * as syncCommand from './commands/sync.js'
import * as statsCommand from './commands/stats.js'

yargs(hideBin(process.argv))

  .middleware(async () => {
    try {
      if (firebaseAdmin.apps.length === 0) {
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.applicationDefault(),
          projectId: 'liturgymaker',
        })
      }
    }
    catch (error) {
      throw new Error(`Erreur d'initialisation: ${error.message}`)
    }
  })
  .command(statsCommand)
  .command(syncCommand)
  .option('dev', {
    describe: 'Use development data',
    boolean: true,
    default: false,
  })
  .demandCommand()
  .recommendCommands()
  .strict()
  .help()
  .parse()
