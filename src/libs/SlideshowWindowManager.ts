import type { LiturgyDocument, SongDocument } from '../types';

class SlideshowWindowManager {
  window: Window | null = null;
  liturgy: LiturgyDocument | null = null;
  songs: SongDocument[] | null = null;

  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
  }

  open() {
    this.window = window.open(
      '/slideshow',
      'slideshow',
      'toolbar=off,location=off',
    );

    window.removeEventListener('message', this.handleMessage);
    window.addEventListener('message', this.handleMessage);
  }

  handleMessage(event: MessageEvent) {
    if (event.data.namespace === 'reveal' && event.data.method === 'ready') {
      this.sendMessage('updateLiturgy', [this.liturgy]);
      this.sendMessage('updateSongs', [this.songs]);
    }
  }

  sendMessage(method: string, args: any[]) {
    if (this.window) {
      this.window.postMessage({ namespace: 'reveal', method, args }, '*');
    }
  }

  setLiturgy(liturgy: LiturgyDocument) {
    this.liturgy = liturgy;
    this.sendMessage('updateLiturgy', [this.liturgy]);
  }

  setSongs(songs: SongDocument[]) {
    this.songs = songs;
    this.sendMessage('updateSongs', [this.songs]);
  }
}

export default SlideshowWindowManager;
