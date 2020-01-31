const superagent = require('superagent');
const { getPassage } = require('../bibleRef');
const getbibleContent = require('./getbible.json');

jest.mock('superagent');

superagent.end = jest.fn().mockImplementation(() => ({
  body: { data: { content: '' } },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('getPassage() with "1 Pierre 1"', async () => {
  await getPassage('1 Pierre 1');

  expect(superagent.query).toHaveBeenCalledWith({
    passage: '1 Pe 1',
    version: 'darby',
  });
});

test('getPassage() with "1 Pierre 1-2"', async () => {
  await getPassage('1 Pierre 1-2');

  expect(superagent.query).toHaveBeenCalledWith({
    passage: '1 Pe 1:1-999;2:1-999',
    version: 'darby',
  });
});

test('getPassage() with "1 Pierre 1-4"', async () => {
  await getPassage('1 Pierre 1-4');

  expect(superagent.query).toHaveBeenCalledWith({
    passage: '1 Pe 1:1-999;2:1-999;3:1-999;4:1-999',
    version: 'darby',
  });
});

test('getPassage() with "1 Pierre 1.1"', async () => {
  await getPassage('1 Pierre 1.1');

  expect(superagent.query).toHaveBeenCalledWith({
    passage: '1 Pe 1:1',
    version: 'darby',
  });
});

test('getPassage() with "1 Pierre 1.1-4"', async () => {
  await getPassage('1 Pierre 1.1-4');

  expect(superagent.query).toHaveBeenCalledWith({
    passage: '1 Pe 1:1-4',
    version: 'darby',
  });
});

test('getPassage() with "1 Pierre 1.1-2.2"', async () => {
  await getPassage('1 Pierre 1.1-2.2');

  expect(superagent.query).toHaveBeenCalledWith({
    passage: '1 Pe 1:1-999;2:1-2',
    version: 'darby',
  });
});

test('getPassage() with "1 Pierre 1.1-4.4"', async () => {
  await getPassage('1 Pierre 1.1-4.4');

  expect(superagent.query).toHaveBeenCalledWith({
    passage: '1 Pe 1:1-999;2:1-999;3:1-999;4:1-4',
    version: 'darby',
  });
});

test('stringifyContent()', async () => {
  superagent.end = jest.fn().mockImplementation(() => ({
    body: { data: { content: getbibleContent } },
  }));

  const result = await getPassage('1 Pierre 1.1-4.4');

  expect(result).toMatchSnapshot();
});
