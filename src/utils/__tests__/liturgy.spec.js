import { test, expect, vi } from 'vitest';

import { convertToId, converToDate, getNextLiturgyId } from '../liturgy';

test('converToDate()', () => {
  expect(converToDate('19830717').toISOString()).toBe(
    '1983-07-17T08:00:00.000Z',
  );
});

test('convertToId()', () => {
  expect(convertToId(new Date('2019-01-01'))).toBe('20190101');
});

test('getCurrentLiturgy() without argument', () => {
  Date.now = vi.fn(() => 426808800000);
  expect(getNextLiturgyId()).toBe('19830717');

  Date.now = vi.fn(() => 427240800000);
  expect(getNextLiturgyId()).toBe('19830717');
});

test('getCurrentLiturgy() with argument', () => {
  expect(getNextLiturgyId(new Date('2019-01-01'))).toBe('20190106');
  expect(getNextLiturgyId('20190101')).toBe('20190106');
});
