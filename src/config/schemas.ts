import * as yup from 'yup'
import type { AnyObject, Maybe } from 'yup'

import type { LiturgyBlock } from '../types'
import { validate } from '../utils/bibleRef'

yup.addMethod(
  yup.string,
  'bibleRef',
  // eslint-disable-next-line no-template-curly-in-string
  function method(message = '${error}') {
    return this.test({
      message,
      name: 'bibleRef',
      test(value) {
        const error = value ? validate(value) : ''

        return (
          !error
          || this.createError({
            params: { error },
          })
        )
      },
    })
  },
)

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext = AnyObject,
    TDefault = undefined,
    TFlags extends yup.Flags = '',
  > extends yup.Schema<TType, TContext, TDefault, TFlags> {
    bibleRef: () => StringSchema<TType, TContext>
  }
}

const announcementsBlockSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      title: yup.string(),
      detail: yup.string(),
    }),
  ),
})

const readingBlockSchema = yup.object().shape({
  bibleRefs: yup.array().of(
    yup.object().shape({
      id: yup.string().bibleRef(),
      excerpt: yup.string(),
    }),
  ),
})

const songsBlockSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      id: yup.string().nullable(),
      infos: yup.string(),
      repeat: yup.boolean(),
    }),
  ),
})

const recitationBlockSchema = yup.object().shape({
  id: yup.string().nullable(),
  infos: yup.string(),
})

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
})

const openDoorsBlockSchema = yup.object().shape({
  title: yup.string(),
  detail: yup.string(),
  prayerTopics: yup.array().of(
    yup.object().shape({
      text: yup.string(),
    }),
  ),
})

const sectionBlockSchema = yup.object().shape({
  title: yup.string(),
})

const blockSchemas = {
  announcements: announcementsBlockSchema,
  reading: readingBlockSchema,
  sermon: sermonBlockSchema,
  section: sectionBlockSchema,
  openDoors: openDoorsBlockSchema,
  songs: songsBlockSchema,
  recitation: recitationBlockSchema,
}

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
})

export const songSchema = yup.object().shape({
  title: yup.string().ensure().required(),
  aka: yup.string().ensure(),
  authors: yup.string().ensure(),
  number: yup.string().ensure(),
  copyright: yup.string().ensure(),
  translation: yup.string().ensure(),
  collection: yup.string().ensure(),
  previewUrl: yup.string().ensure().url(),
  lyrics: yup
    .array()
    .of(
      yup.object().shape({
        text: yup.string().ensure(),
        type: yup.string().oneOf(['verse', 'chorus']).ensure(),
      }),
    )
    .required(),
})

export const recitationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup
    .array()
    .of(
      yup.object().shape({
        text: yup.string().ensure(),
      }),
    )
    .required(),
})
