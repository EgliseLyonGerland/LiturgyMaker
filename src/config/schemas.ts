import * as yup from 'yup';
import type { AnyObject, Maybe } from 'yup/lib/types';

import type { LiturgyBlock } from '../types';
import { validate } from '../utils/bibleRef';

yup.addMethod(
  yup.string,
  'bibleRef',
  // eslint-disable-next-line no-template-curly-in-string
  function method(message = '${error}') {
    return this.test({
      message,
      name: 'bibleRef',
      test(value) {
        const error = value ? validate(value) : '';

        return (
          !error ||
          this.createError({
            params: { error },
          })
        );
      },
    });
  },
);

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends yup.BaseSchema<TType, TContext, TOut> {
    bibleRef(): StringSchema<TType, TContext>;
  }
}

const announcementsBlockSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      title: yup.string(),
      detail: yup.string(),
    }),
  ),
});

const readingBlockSchema = yup.object().shape({
  bibleRefs: yup.array().of(
    yup.object().shape({
      id: yup.string().bibleRef(),
      excerpt: yup.string(),
    }),
  ),
});

const songsBlockSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      id: yup.string().nullable(),
      infos: yup.string(),
      repeat: yup.boolean(),
    }),
  ),
});

const recitationBlockSchema = yup.object().shape({
  id: yup.string().nullable(),
  infos: yup.string(),
});

const sermonBlockSchema = yup.object().shape({
  title: yup.string(),
  author: yup.string(),
  bibleRefs: yup.array().of(
    yup.object().shape({
      id: yup.string().bibleRef(),
    }),
  ),
  plan: yup.array().of(
    yup.object().shape({
      text: yup.string(),
    }),
  ),
});

const openDoorsBlockSchema = yup.object().shape({
  title: yup.string(),
  detail: yup.string(),
  prayerTopics: yup.array().of(
    yup.object().shape({
      text: yup.string(),
    }),
  ),
});

const sectionBlockSchema = yup.object().shape({
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
  // eslint-disable-next-line react/forbid-prop-types
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
  title: yup.string().ensure().required(),
  aka: yup.string().ensure(),
  authors: yup.string().ensure().nullable(),
  number: yup.number().min(1).nullable(),
  copyright: yup.string().ensure().nullable(),
  translation: yup.string().ensure().nullable(),
  collection: yup.string().ensure().nullable(),
  previewUrl: yup.string().ensure().url(),
  lyrics: yup.array().of(
    yup.object().shape({
      text: yup.string().ensure(),
      type: yup.string().oneOf(['verse', 'chorus']),
    }),
  ),
});

export const recitationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.array().of(
    yup.object().shape({
      text: yup.string().ensure(),
    }),
  ),
});
