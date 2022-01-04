const fetchJsonp = require('fetch-jsonp');

const { getPassage, parse } = require('../bibleRef');
const getbibleContent = require('./getbible.json');

jest.mock('fetch-jsonp');

beforeEach(() => {
  jest.clearAllMocks();

  fetchJsonp.mockResolvedValue({
    json: jest.fn().mockResolvedValue(getbibleContent),
  });
});

function encode(str) {
  return encodeURIComponent(str).replace(/%20/g, '+');
}

test('getPassage() with "1 Pierre 1"', async () => {
  await getPassage('1 Pierre 1');

  expect(fetchJsonp).toHaveBeenCalledWith(
    'https://getbible.net/json?version=ls1910&passage=' + encode('1 Pe 1'),
  );
});

test('getPassage() with "1 Pierre 1-2"', async () => {
  await getPassage('1 Pierre 1-2');

  expect(fetchJsonp).toHaveBeenCalledWith(
    'https://getbible.net/json?version=ls1910&passage=' +
      encode('1 Pe 1:1-999;2:1-999'),
  );
});

test('getPassage() with "1 Pierre 1-4"', async () => {
  await getPassage('1 Pierre 1-4');

  expect(fetchJsonp).toHaveBeenCalledWith(
    'https://getbible.net/json?version=ls1910&passage=' +
      encode('1 Pe 1:1-999;2:1-999;3:1-999;4:1-999'),
  );
});

test('getPassage() with "1 Pierre 1.1"', async () => {
  await getPassage('1 Pierre 1.1');

  expect(fetchJsonp).toHaveBeenCalledWith(
    'https://getbible.net/json?version=ls1910&passage=' + encode('1 Pe 1:1'),
  );
});

test('getPassage() with "1 Pierre 1.1-4"', async () => {
  await getPassage('1 Pierre 1.1-4');

  expect(fetchJsonp).toHaveBeenCalledWith(
    'https://getbible.net/json?version=ls1910&passage=' + encode('1 Pe 1:1-4'),
  );
});

test('getPassage() with "1 Pierre 1.1-2.2"', async () => {
  await getPassage('1 Pierre 1.1-2.2');

  expect(fetchJsonp).toHaveBeenCalledWith(
    'https://getbible.net/json?version=ls1910&passage=' +
      encode('1 Pe 1:1-999;2:1-2'),
  );
});

test('getPassage() with "1 Pierre 1.1-4.4"', async () => {
  await getPassage('1 Pierre 1.1-4.4');

  expect(fetchJsonp).toHaveBeenCalledWith(
    'https://getbible.net/json?version=ls1910&passage=' +
      encode('1 Pe 1:1-999;2:1-999;3:1-999;4:1-4'),
  );
});

test('stringifyContent()', async () => {
  const result = await getPassage('1 Pierre 1.1-4.4');

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
});
