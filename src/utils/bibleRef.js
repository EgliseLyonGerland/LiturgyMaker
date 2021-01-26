import superagent from 'superagent';
import jsonp from 'superagent-jsonp';
import trim from 'lodash/trim';
import deburr from 'lodash/deburr';
import find from 'lodash/find';
import slugify from './slugify';

import books from '../config/bibleBooks.json';

const bookNames = books.map(({ name }) => deburr(name));

function merge(fields, values) {
  return fields.reduce(
    (acc, key, index) => ({
      ...acc,
      [key]: key === 'book' ? values[index] : parseInt(values[index], 10),
    }),
    {},
  );
}

function stringifyContent({ book = [] } = {}) {
  return book.reduce(
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

export function parse(ref) {
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
    {
      regExp: /^(.+?) *(\d+)$/,
      fields: ['book', 'chapterStart'],
    },
    {
      regExp: /^(.+?) *(\d+)-(\d+)$/,
      fields: ['book', 'chapterStart', 'chapterEnd'],
    },
    {
      regExp: /^(.+?) *(\d+)\.(\d+[a-z]?)$/,
      fields: ['book', 'chapterStart', 'verseStart'],
    },
    {
      regExp: /^(.+?) *(\d+)\.(\d+[a-z]?)-(\d+[a-z]?)$/,
      fields: ['book', 'chapterStart', 'verseStart', 'verseEnd'],
    },
    {
      regExp: /^(.+?) *(\d+)\.(\d+[a-z]?)-(\d+)\.(\d+[a-z]?)$/,
      fields: ['book', 'chapterStart', 'verseStart', 'chapterEnd', 'verseEnd'],
    },
  ];

  const ref$ = trim(ref);

  return exprs.reverse().reduce((acc, { regExp, fields }) => {
    const matches = regExp.exec(ref$);

    if (acc) {
      return acc;
    }

    if (matches) {
      return merge(fields, matches.slice(1));
    }

    return null;
  }, null);
}

export function validate(ref) {
  const data = parse(ref);

  if (!data) {
    return 'Format incorrect';
  }

  if (!bookNames.includes(deburr(data.book))) {
    return 'Livre non-reconnu';
  }

  return '';
}

export async function getPassage(ref) {
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
