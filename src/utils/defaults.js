import { v4 as uuid } from 'uuid';
import shuffle from 'lodash/shuffle';
import upperFirst from 'lodash/upperFirst';
import { verseTemplates } from '../config/preview';
import { currentVersion } from '../config/global';

const shuffledVerseTemplates = shuffle(verseTemplates);

export const createDefaultAnnouncementsBlock = () => ({
  id: uuid(),
  type: 'announcements',
  data: [{ title: '', detail: '' }],
});

export const createDefaultReadingBlock = ({ title = '' } = {}) => ({
  id: uuid(),
  type: 'reading',
  ...(title ? { title } : null),
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
  id: uuid(),
  type: 'sermon',
  data: {
    author: '',
    bibleRefs: [''],
    title: '',
    plan: [''],
  },
});

export const createDefaultOpenDoorsBlock = () => ({
  id: uuid(),
  type: 'openDoors',
  data: {
    title: '',
    detail: '',
    prayerTopics: [],
  },
});

export const createDefaultSectionBlock = ({ title = '' } = {}) => ({
  id: uuid(),
  type: 'section',
  data: {
    title,
  },
});

export const createDefaultSongsBlock = () => ({
  id: uuid(),
  type: 'songs',
  data: [],
});

export const createDefaultRecitationBlock = () => ({
  id: uuid(),
  type: 'recitation',
  data: {},
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

export const createDefaultLiturgy = ({ date }) => ({
  date: +date,
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
