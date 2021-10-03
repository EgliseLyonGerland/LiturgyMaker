import * as yup from 'yup';

import type { LiturgyBlock } from '../types';

export const announcementsBlockSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      title: yup.string(),
      detail: yup.string(),
    }),
  ),
});

export const readingBlockSchema = yup.object().shape({
  bibleRefs: yup.array().of(
    yup.object().shape({
      ref: yup.string(),
      excerpt: yup.string(),
    }),
  ),
});

export const songsBlockSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      id: yup.string().nullable(),
      infos: yup.string(),
      repeat: yup.boolean(),
    }),
  ),
});

export const recitationBlockSchema = yup.object().shape({
  id: yup.string().nullable(),
  infos: yup.string(),
});

export const sermonBlockSchema = yup.object().shape({
  title: yup.string(),
  author: yup.string(),
  bibleRefs: yup.array().of(
    yup.object().shape({
      ref: yup.string(),
    }),
  ),
  plan: yup.array().of(
    yup.object().shape({
      text: yup.string(),
    }),
  ),
});

export const openDoorsBlockSchema = yup.object().shape({
  title: yup.string(),
  detail: yup.string(),
  prayerTopics: yup.array().of(
    yup.object().shape({
      text: yup.string(),
    }),
  ),
});

export const sectionBlockSchema = yup.object().shape({
  title: yup.string(),
});

const blockSchemas = {
  announcements: announcementsBlockSchema,
  reading: readingBlockSchema,
  sermon: sermonBlockSchema,
  section: sectionBlockSchema,
  openDoors: openDoorsBlockSchema,
  songs: songsBlockSchema,
  recitation: recitationBlockSchema,
};

export const liturgySchema = yup.object().shape({
  blocks: yup.array(
    yup.lazy((value: LiturgyBlock) =>
      yup.object().shape({
        type: yup.string(),
        title: yup.string(),
        data: blockSchemas[value.type],
      }),
    ),
  ),
});

export const songSchema = yup.object().shape({
  title: yup.string(),
  aka: yup.string(),
  authors: yup.string().nullable(),
  number: yup.number().min(1).nullable(),
  copyright: yup.string().nullable(),
  translation: yup.string().nullable(),
  collection: yup.string().nullable(),
  lyrics: yup.array().of(
    yup.object().shape({
      text: yup.string(),
      type: yup.string().oneOf(['verse', 'chorus']),
    }),
  ),
});
