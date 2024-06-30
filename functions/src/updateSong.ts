import { env } from 'node:process'
import { onDocumentWritten } from 'firebase-functions/v2/firestore'
import { onTaskDispatched } from 'firebase-functions/v2/tasks'
import { getStorage } from 'firebase-admin/storage'
import { getFirestore } from 'firebase-admin/firestore'
import { getFunctions } from 'firebase-admin/functions'
import { GoogleAuth } from 'google-auth-library'

type Maybe<T> = T | undefined

interface SongDocument {
  id: string
}

const storage = getStorage()
const db = getFirestore()

const location = 'europe-west1'

function deployApp() {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'application/vnd.github+json')
  myHeaders.append('Authorization', `Bearer ${env.GITHUB_TOKEN}`)
  myHeaders.append('X-GitHub-Api-Version', '2022-11-28')
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    ref: 'main',
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  } as const

  fetch('https://api.github.com/repos/EgliseLyonGerland/PraiseExplorer/actions/workflows/deploy.yml/dispatches', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error))
}

async function getFunctionUrl(name: string) {
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  })
  const projectId = await auth.getProjectId()
  const url = 'https://cloudfunctions.googleapis.com/v2beta/'
    + `projects/${projectId}/locations/${location}/functions/${name}`

  const client = await auth.getClient()
  const res = await client.request<{ serviceConfig?: { uri: string } }>({ url })
  const uri = res.data?.serviceConfig?.uri
  if (!uri) {
    throw new Error(`Unable to retreive uri for function at ${url}`)
  }
  return uri
}

export const updateSongTask = onTaskDispatched<{ songId: string }>(
  {
    retryConfig: {
      maxAttempts: 5,
      minBackoffSeconds: 60,
    },
    rateLimits: {
      maxConcurrentDispatches: 1,
    },
  },
  async (req) => {
    const file = storage.bucket().file('songs.json')

    let songs: SongDocument[] | undefined

    try {
      const result = await file.download()
      songs = JSON.parse(result.toString())
    }
    catch (error) {
    }

    if (!songs) {
      const { docs } = await db.collection('songs').get()
      const data = docs.map(doc => ({ id: doc.id, ...doc.data() }))
      file.save(JSON.stringify(data))

      return
    }

    const { songId } = req.data
    const snapshot = await db.collection('songs').doc(songId).get()

    const data = {
      id: songId,
      ...snapshot.data(),
    } as Maybe<SongDocument>

    if (!data) {
      throw new Error(`Unable to find the song ${songId}`)
    }

    const index = songs.findIndex(item => item.id === songId)

    if (index > -1) {
      songs[index] = data
    }
    else {
      songs.push(data)
    }

    await file.save(JSON.stringify(songs))

    // eslint-disable-next-line node/prefer-global/process
    if (!process.env.FUNCTIONS_EMULATOR) {
      await deployApp()
    }
  },
)

export const onSongUpdated = onDocumentWritten(
  {
    document: 'songs/{songId}',
  },
  async (event) => {
    const queue = getFunctions().taskQueue(`locations/${location}/functions/updateSongTask`)
    const uri = await getFunctionUrl('updateSongTask')
    const { songId } = event.params
    await queue.enqueue({ songId }, { uri })
  },
)
