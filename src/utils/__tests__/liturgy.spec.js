import { expect, it, vi } from 'vitest'

import { converToDate, convertToId, getNextLiturgyId } from '../liturgy'

it('converToDate()', () => {
  expect(converToDate('19830717').toISOString()).toBe(
    '1983-07-17T08:00:00.000Z',
  )
})

it('convertToId()', () => {
  expect(convertToId(new Date('2019-01-01'))).toBe('20190101')
})

it('getCurrentLiturgy() without argument', () => {
  Date.now = vi.fn(() => 426808800000)
  expect(getNextLiturgyId()).toBe('19830717')

  Date.now = vi.fn(() => 427240800000)
  expect(getNextLiturgyId()).toBe('19830717')
})

it('getCurrentLiturgy() with argument', () => {
  expect(getNextLiturgyId(new Date('2019-01-01'))).toBe('20190106')
  expect(getNextLiturgyId('20190101')).toBe('20190106')
})
