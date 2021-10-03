import deburr from 'lodash/deburr';
import find from 'lodash/find';
import superagent from 'superagent';
import jsonp from 'superagent-jsonp';

import books from '../config/bibleBooks.json';
import slugify from './slugify';

interface GetBibleResponse {
  book: {
    book_ref: string;
    book_name: string;
    book_nr: string;
    chapter_nr: string;
    chapter: Record<
      string,
      {
        verse_nr: string;
        verse: string;
      }
    >;
  }[];
}

interface BibleRef {
  book: string;
  chapterStart: number;
  verseStart: number | null;
  chapterEnd: number | null;
  verseEnd: number | null;
}

const bookNames = books.map(({ name }) => deburr(name));

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
  ];

  return exprs.reverse().reduce<BibleRef | null>((acc, regExp) => {
    if (acc) {
      return acc;
    }

    const matches = regExp.exec(ref.trim());

    if (!matches || !matches.groups) {
      return null;
    }

    return {
      book: matches.groups.book,
      chapterStart: Number(matches.groups.chapterStart),
      verseStart: Number(matches.groups.verseStart) || null,
      chapterEnd: Number(matches.groups.chapterEnd) || null,
      verseEnd: Number(matches.groups.verseEnd) || null,
    };
  }, null);
}

export function validate(ref: string) {
  const data = parse(ref);

  if (!data) {
    return 'Format incorrect';
  }

  if (!bookNames.includes(deburr(data.book))) {
    return 'Livre non-reconnu';
  }

  return '';
}

function stringifyContent({ book }: GetBibleResponse = { book: [] }) {
  return book.reduce<string>(
    (acc, curr) =>
      (
        acc +
        Object.values(curr.chapter)
          .map(({ verse }) => verse.trim())
          .join(' ')
          .split('¶')
          .map((text) => text.trim())
          .join(' ')
      ).trim(),
    '',
  );
}

export async function getPassage(ref: string) {
  const data = parse(ref);

  if (!data || !data.chapterStart) return null;

  const version = 'ls1910';
  const book = find(books, ['slug', slugify(data.book)]);

  if (!book) return null;

  const { id: bookId } = book;
  const { chapterStart, chapterEnd, verseStart, verseEnd } = data;

  let passage = `${bookId} ${chapterStart}`;

  if (chapterEnd && chapterEnd > chapterStart) {
    passage += ':1-999';

    for (let i = chapterStart + 1; i <= chapterEnd; i += 1) {
      if (verseEnd && i === chapterEnd) {
        passage += `;${i}:1-${verseEnd}`;
      } else {
        passage += `;${i}:1-999`;
      }
    }
  } else if (verseEnd) {
    passage += `:${verseStart}-${verseEnd}`;
  } else if (verseStart) {
    passage += `:${verseStart}`;
  }

  const res = await superagent
    .get('https://getbible.net/json')
    .use(jsonp({ timeout: 10000 }))
    .query({ version, passage })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (res.body) {
    return stringifyContent(res.body);
  }

  return '';
}
