import type { LiturgyDocument, SongDocument } from '../types'

export type Message =
  | {
    namespace: 'reveal'
    method: 'ready'
    args: []
  }
  | {
    namespace: 'reveal'
    method: 'updateLiturgy'
    args: [LiturgyDocument]
  }
  | {
    namespace: 'reveal'
    method: 'updateSongs'
    args: [SongDocument[]]
  }

class SlideshowWindowManager {
  window: Window | null = null

  liturgy: LiturgyDocument | null = null

  songs: SongDocument[] | null = null

  constructor() {
    this.handleMessage = this.handleMessage.bind(this)
  }

  open() {
    this.window = window.open(
      '/slideshow',
      'slideshow',
      'toolbar=off,location=off',
    )

    window.removeEventListener('message', this.handleMessage)
    window.addEventListener('message', this.handleMessage)
  }

  handleMessage(event: MessageEvent<Message>) {
    if (event.data.namespace === 'reveal' && event.data.method === 'ready') {
      if (this.liturgy) {
        this.sendMessage('updateLiturgy', [this.liturgy])
      }
      if (this.songs) {
        this.sendMessage('updateSongs', [this.songs])
      }
    }
  }

  sendMessage(method: Message['method'], args: Message['args']) {
    if (this.window) {
      this.window.postMessage({ namespace: 'reveal', method, args }, '*')
    }
  }

  setLiturgy(liturgy: LiturgyDocument) {
    this.liturgy = liturgy
    this.sendMessage('updateLiturgy', [this.liturgy])
  }

  setSongs(songs: SongDocument[]) {
    this.songs = songs
    this.sendMessage('updateSongs', [this.songs])
  }
}

export default SlideshowWindowManager
