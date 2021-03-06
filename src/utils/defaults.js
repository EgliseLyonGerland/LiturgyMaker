import shuffle from 'lodash/shuffle';
import upperFirst from 'lodash/upperFirst';
import { verseTemplates } from '../config/preview';
import { currentVersion } from '../config/global';
import { converToDate } from './liturgy';

const shuffledVerseTemplates = shuffle(verseTemplates);

export const createDefaultAnnouncementsBlock = () => ({
  type: 'announcements',
  title: '',
  data: [{ title: '', detail: '' }],
});

export const createDefaultReadingBlock = ({ title = '' } = {}) => ({
  type: 'reading',
  title,
  data: {
    bibleRefs: [
      {
        ref: '',
        excerpt: '',
        template: shuffledVerseTemplates[0],
      },
    ],
  },
});

export const createDefaultSermonBlock = () => ({
  type: 'sermon',
  title: '',
  data: {
    title: '',
    author: '',
    bibleRefs: [{ ref: '' }],
    plan: [{ text: '' }],
  },
});

export const createDefaultOpenDoorsBlock = () => ({
  type: 'openDoors',
  title: '',
  data: {
    title: '',
    detail: '',
    prayerTopics: [{ text: '' }],
  },
});

export const createDefaultSectionBlock = ({ title = '' } = {}) => ({
  type: 'section',
  title: '',
  data: {
    title,
  },
});

export const createDefaultSongsBlock = () => ({
  type: 'songs',
  title: '',
  data: [],
});

export const createDefaultRecitationBlock = () => ({
  type: 'recitation',
  title: '',
  data: {
    id: '',
    infos: '',
  },
});

const functions = {
  createDefaultAnnouncementsBlock,
  createDefaultReadingBlock,
  createDefaultSermonBlock,
  createDefaultOpenDoorsBlock,
  createDefaultSectionBlock,
  createDefaultSongsBlock,
  createDefaultRecitationBlock,
};

export const createDefaultBlock = (type, ...args) => {
  const funcName = `createDefault${upperFirst(type)}Block`;

  return functions[funcName](...args);
};

export const createDefaultLiturgy = (id) => ({
  date: +converToDate(id),
  version: currentVersion,
  blocks: [
    createDefaultAnnouncementsBlock('announcements'),
    createDefaultReadingBlock({ title: 'Ouverture' }),
    createDefaultReadingBlock({ title: 'Loi de Dieu' }),
    createDefaultReadingBlock({ title: 'Grâce de Dieu' }),
    createDefaultReadingBlock({ title: 'Inter-chants' }),
    createDefaultSermonBlock(),
    createDefaultOpenDoorsBlock(),
    createDefaultSectionBlock({ title: 'Prière' }),
    createDefaultReadingBlock({ title: 'Envoi' }),
  ],
});
