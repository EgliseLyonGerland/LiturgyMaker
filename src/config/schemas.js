import * as yup from 'yup';

export const bibleRefSchema = yup.string();

export const announcementsBlockSchema = {
  items: yup.array().of(
    yup.object().shape({
      title: yup.string(),
      detail: yup.string(),
    }),
  ),
};

export const readingBlockSchema = {
  bibleRefs: yup.array().of(
    yup.object().shape({
      ref: bibleRefSchema,
      excerpt: yup.string(),
    }),
  ),
};

export const songsBlockSchema = {
  items: yup.array().of(
    yup.object().shape({
      id: yup.string().nullable(),
      infos: yup.string(),
      repeat: yup.boolean(),
    }),
  ),
};

export const recitationBlockSchema = {
  id: yup.string().nullable(),
  infos: yup.string(),
};

export const sermonBlockSchema = {
  title: yup.string(),
  author: yup.string(),
  bibleRefs: yup.array().of(
    yup.object().shape({
      ref: bibleRefSchema,
    }),
  ),
  plan: yup.array().of(
    yup.object().shape({
      text: yup.string(),
    }),
  ),
};

export const openDoorsBlockSchema = {
  title: yup.string(),
  detail: yup.string(),
  prayerTopics: yup.array().of(
    yup.object().shape({
      text: bibleRefSchema,
    }),
  ),
  plan: yup.array().of(
    yup.object().shape({
      text: yup.string(),
    }),
  ),
};

export const sectionBlockSchema = {
  title: yup.string(),
};

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
  blocks: yup.array().of(
    yup.lazy((value) =>
      yup.object().shape({
        type: yup.string(),
        title: yup.string(),
        data: yup.object().shape(blockSchemas[value.type]),
      }),
    ),
  ),
});

export const songSchema = yup.object().shape({
  title: yup.string(),
  authors: yup.string().nullable(),
  number: yup.number().min(1),
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
