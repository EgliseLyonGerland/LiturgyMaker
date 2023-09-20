import { vi, expect, test, beforeEach } from 'vitest';

import getbible1Pierre1Fixtures from './__fixtures__/getbible-60-1.json';
import getbible1Pierre2Fixtures from './__fixtures__/getbible-60-2.json';
import getbible1Pierre3Fixtures from './__fixtures__/getbible-60-3.json';
import { getPassage, parse } from '../bibleRef';

beforeEach(() => {
  vi.clearAllMocks();

  global.fetch = vi.fn();

  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(getbible1Pierre1Fixtures),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(getbible1Pierre2Fixtures),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(getbible1Pierre3Fixtures),
    })
    .mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue(null),
    });
});

const endpoint = 'https://api.getbible.net/v2/ls1910';

test('getPassage() with "1 Pierre 1"', async () => {
  const result = await getPassage('1 Pierre 1');

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${endpoint}/60/1.json`);

  expect(result).toMatchSnapshot();
});

test('getPassage() with "1 Pierre 1-2"', async () => {
  const result = await getPassage('1 Pierre 1-2');

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenNthCalledWith(1, `${endpoint}/60/1.json`);
  expect(fetch).toHaveBeenNthCalledWith(2, `${endpoint}/60/2.json`);

  expect(result).toMatchSnapshot();
});

test('getPassage() with "1 Pierre 1-4"', async () => {
  const result = await getPassage('1 Pierre 1-4');

  expect(fetch).toHaveBeenCalledTimes(4);
  expect(fetch).toHaveBeenNthCalledWith(1, `${endpoint}/60/1.json`);
  expect(fetch).toHaveBeenNthCalledWith(2, `${endpoint}/60/2.json`);
  expect(fetch).toHaveBeenNthCalledWith(3, `${endpoint}/60/3.json`);
  expect(fetch).toHaveBeenNthCalledWith(4, `${endpoint}/60/4.json`);

  expect(result).toMatchSnapshot();
});

test('getPassage() with "1 Pierre 1.1"', async () => {
  const result = await getPassage('1 Pierre 1.1');

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${endpoint}/60/1.json`);

  expect(result).toMatchSnapshot();
});

test('getPassage() with "1 Pierre 1.1-4"', async () => {
  const result = await getPassage('1 Pierre 1.1-4');

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`${endpoint}/60/1.json`);

  expect(result).toMatchSnapshot();
});

test('getPassage() with "1 Pierre 1.10-2.2"', async () => {
  const result = await getPassage('1 Pierre 1.10-2.2');

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenNthCalledWith(1, `${endpoint}/60/1.json`);
  expect(fetch).toHaveBeenNthCalledWith(2, `${endpoint}/60/2.json`);

  expect(result).toMatchSnapshot();
});

test('getPassage() with "1 Pierre 1.1-4.4"', async () => {
  const result = await getPassage('1 Pierre 1.1-4.4');

  expect(fetch).toHaveBeenCalledTimes(4);
  expect(fetch).toHaveBeenNthCalledWith(1, `${endpoint}/60/1.json`);
  expect(fetch).toHaveBeenNthCalledWith(2, `${endpoint}/60/2.json`);
  expect(fetch).toHaveBeenNthCalledWith(3, `${endpoint}/60/3.json`);
  expect(fetch).toHaveBeenNthCalledWith(4, `${endpoint}/60/4.json`);

  expect(result).toMatchSnapshot();
});

test('parse()', () => {
  expect(parse('1 Pierre')).toEqual(null);
  expect(parse('1 Pierre 15')).toEqual({
    book: '1 Pierre',
    chapterStart: 15,
    verseStart: null,
    chapterEnd: null,
    verseEnd: null,
  });
  expect(parse('1 Pierre 15-16')).toEqual({
    book: '1 Pierre',
    chapterStart: 15,
    verseStart: null,
    chapterEnd: 16,
    verseEnd: null,
  });
  expect(parse('1 Pierre 15.3')).toEqual({
    book: '1 Pierre',
    chapterStart: 15,
    verseStart: 3,
    chapterEnd: null,
    verseEnd: null,
  });
  expect(parse('1 Pierre 15.3-8')).toEqual({
    book: '1 Pierre',
    chapterStart: 15,
    verseStart: 3,
    chapterEnd: null,
    verseEnd: 8,
  });
  expect(parse('1 Pierre 15.3-16.8')).toEqual({
    book: '1 Pierre',
    chapterStart: 15,
    verseStart: 3,
    chapterEnd: 16,
    verseEnd: 8,
  });
  expect(parse('Psaumes 1')).toEqual({
    book: 'Psaumes',
    chapterStart: 1,
    verseStart: null,
    chapterEnd: null,
    verseEnd: null,
  });
  expect(parse('Psaume 1')).toEqual({
    book: 'Psaume',
    chapterStart: 1,
    verseStart: null,
    chapterEnd: null,
    verseEnd: null,
  });
});
