/* eslint-disable regexp/no-super-linear-backtracking */
import { range } from 'lodash'
import deburr from 'lodash/deburr'

import books from '../config/bibleBooks.json'

interface GetBibleResponse {
  chapter: number
  verses: {
    chapter: number
    verse: number
    name: string
    text: string
  }[]
}

interface BibleRef {
  book: string
  chapterStart: number
  verseStart: number | null
  chapterEnd: number | null
  verseEnd: number | null
}

const bookNames = books.reduce<string[]>(
  (acc, { name, alt }) =>
    alt
      ? acc.concat(deburr(name)).concat(deburr(alt))
      : acc.concat(deburr(name)),
  [],
)

export function parse(ref: string): BibleRef | null {
  /**
   * Examples:
   *
   *  - 1 Pierre
   *  - 1 Pierre 15
   *  - 1 Pierre 15-16
   *  - 1 Pierre 15.3
   *  - 1 Pierre 15.3-8
   *  - 1 Pierre 15.3-16.8
   */
  const exprs = [
    // {
    //   regExp: /^(.+?)$/,
    //   fields: ["book"]
    // },
    /^(?<book>.+?) *(?<chapterStart>\d+)$/,
    /^(?<book>.+?) *(?<chapterStart>\d+)-(?<chapterEnd>\d+)$/,
    /^(?<book>.+?) *(?<chapterStart>\d+)\.(?<verseStart>\d+[a-z]?)$/,
    /^(?<book>.+?) *(?<chapterStart>\d+)\.(?<verseStart>\d+[a-z]?)-(?<verseEnd>\d+[a-z]?)$/,
    /^(?<book>.+?) *(?<chapterStart>\d+)\.(?<verseStart>\d+[a-z]?)-(?<chapterEnd>\d+)\.(?<verseEnd>\d+[a-z]?)$/,
  ]

  return exprs.reverse().reduce<BibleRef | null>((acc, regExp) => {
    if (acc) {
      return acc
    }

    const matches = regExp.exec(ref.trim())

    if (!matches || !matches.groups) {
      return null
    }

    return {
      book: matches.groups.book,
      chapterStart: Number(matches.groups.chapterStart),
      verseStart: Number(matches.groups.verseStart) || null,
      chapterEnd: Number(matches.groups.chapterEnd) || null,
      verseEnd: Number(matches.groups.verseEnd) || null,
    }
  }, null)
}

export function validate(ref: string) {
  const data = parse(ref)

  if (!data) {
    return 'Format incorrect'
  }

  if (!bookNames.includes(deburr(data.book))) {
    return 'Livre non-reconnu'
  }

  return ''
}

function sanitize(text: string) {
  return text.replace(/([^ ])([:;?!])/g, '$1 $2')
}

export async function getPassage(ref: string) {
  const data = parse(ref)

  if (!data || !data.chapterStart) {
    return null
  }

  const version = 'ls1910'
  const bookId
    = books.findIndex(
      ({ name, alt }) => name === data.book || alt === data.book,
    ) + 1

  if (!bookId)
    return null

  const { chapterStart } = data
  const chapterEnd = data.chapterEnd || chapterStart
  const verseStart = data.verseStart || 1
  const verseEnd = data.verseStart ? data.verseEnd || verseStart : Infinity

  const result = (
    await Promise.all(
      range(chapterStart, chapterEnd + 1).map(chapter =>
        fetch(
          `https://api.getbible.net/v2/${version}/${bookId}/${chapter}.json`,
        ).then(res =>
          res.ok ? (res.json() as Promise<GetBibleResponse>) : null,
        ),
      ),
    )
  ).reduce((acc, chapter) => {
    if (!chapter) {
      return acc
    }

    const content = chapter.verses
      .slice(
        chapter.chapter === chapterStart ? verseStart - 1 : 0,
        chapter.chapter === chapterEnd ? verseEnd : chapter.verses.length,
      )
      .map(verse => verse.text)
      .join(' ')

    return `${acc}\n\n${content}`.trim()
  }, '')

  return sanitize(result)
}
