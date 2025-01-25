import { uid } from 'uid'
import { currentVersion } from '../config/global'
import type { BlockType } from '../types'
import { converToDate } from './liturgy'

export function createDefaultAnnouncementsBlock() {
  return {
    id: uid(),
    type: 'announcements',
    title: '',
    data: {
      items: [{ title: '', detail: '' }],
    },
  }
}

export function createDefaultReadingBlock({ title = '' } = {}) {
  return {
    id: uid(),
    type: 'reading',
    title,
    data: {
      bibleRefs: [
        {
          id: '',
          excerpt: '',
        },
      ],
    },
  }
}

export function createDefaultSermonBlock() {
  return {
    id: uid(),
    type: 'sermon',
    title: '',
    data: {
      title: '',
      author: '',
      bibleRefs: [{ id: '' }],
      plan: [{ text: '' }],
    },
  }
}

export function createDefaultOpenDoorsBlock() {
  return {
    id: uid(),
    type: 'openDoors',
    title: '',
    data: {
      title: '',
      detail: '',
      prayerTopics: [{ text: '' }],
    },
  }
}

export function createDefaultSectionBlock({ title = '' } = {}) {
  return {
    id: uid(),
    type: 'section',
    title: '',
    data: {
      title,
    },
  }
}

export function createDefaultSongsBlock() {
  return {
    id: uid(),
    type: 'songs',
    title: '',
    data: {
      items: [],
    },
  }
}

export function createDefaultRecitationBlock() {
  return {
    id: uid(),
    type: 'recitation',
    title: '',
    data: {
      id: '',
      infos: '',
    },
  }
}

const functions = {
  announcements: createDefaultAnnouncementsBlock,
  reading: createDefaultReadingBlock,
  sermon: createDefaultSermonBlock,
  openDoors: createDefaultOpenDoorsBlock,
  section: createDefaultSectionBlock,
  songs: createDefaultSongsBlock,
  recitation: createDefaultRecitationBlock,
} as const

export function createDefaultBlock<T extends BlockType>(type: T, ...args: Parameters<(typeof functions)[T]>) {
  return functions[type](...args)
}

export function createDefaultLiturgy(id: string) {
  return {
    date: +converToDate(id),
    version: currentVersion,
    blocks: [
      createDefaultAnnouncementsBlock(),
      createDefaultReadingBlock({ title: 'Ouverture' }),
      createDefaultReadingBlock({ title: 'Loi de Dieu' }),
      createDefaultReadingBlock({ title: 'Grâce de Dieu' }),
      createDefaultReadingBlock({ title: 'Inter-chants' }),
      createDefaultSermonBlock(),
      createDefaultSongsBlock(),
      createDefaultSectionBlock({ title: 'Sainte cène' }),
      createDefaultOpenDoorsBlock(),
      createDefaultSongsBlock(),
      createDefaultReadingBlock({ title: 'Envoi' }),
    ],
  }
}
