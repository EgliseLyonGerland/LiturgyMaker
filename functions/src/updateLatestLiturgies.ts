import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions'
import { getStorage } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import deployPraiseExplorerApp from './utils/deployPraiseExplorerApp'

const storage = getStorage()
const db = getFirestore()

export const updateLatestLiturgies = onSchedule('every Sunday 06:00', async () => {
  const now = +new Date() + 86_400_000

  const { docs } = await db
    .collection('liturgies')
    .where('date', '<', now)
    .orderBy('date', 'desc')
    .limit(12)
    .get()

  const data = docs.map(doc => ({ id: doc.id, ...doc.data() }))

  const file = storage.bucket().file('latestLiturgies.json')
  await file.save(JSON.stringify(data))
  await deployPraiseExplorerApp()

  logger.log('Done')
})
