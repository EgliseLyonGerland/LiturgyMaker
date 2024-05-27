import { beforeEach, expect, it, vi } from 'vitest'

import SlideshowWindowManager from '../SlideshowWindowManager'

const fakeWindow = {
  postMessage: vi.fn(),
}

window.open = vi.fn()
window.removeEventListener = vi.fn()
window.addEventListener = vi.fn()

beforeEach(() => {
  window.open.mockReturnValue(fakeWindow)
})

it('open()', () => {
  const manager = new SlideshowWindowManager()
  manager.open()

  expect(manager.window).toEqual(fakeWindow)
  expect(window.open).toHaveBeenCalledWith(
    '/slideshow',
    'slideshow',
    'toolbar=off,location=off',
  )
  expect(window.addEventListener).toHaveBeenCalledWith(
    'message',
    manager.handleMessage,
  )
  expect(window.removeEventListener).toHaveBeenCalledWith(
    'message',
    manager.handleMessage,
  )
})

it('handleMessage()', () => {
  const manager = new SlideshowWindowManager()
  manager.sendMessage = vi.fn()

  manager.setLiturgy('foo')
  manager.setSongs('bar')
  manager.sendMessage.mockClear()
  manager.handleMessage(new MessageEvent('message', { data: 'foo' }))

  expect(manager.sendMessage).not.toHaveBeenCalled()

  manager.handleMessage(
    new MessageEvent('message', {
      data: { namespace: 'reveal', method: 'ready' },
    }),
  )

  expect(manager.sendMessage).toHaveBeenCalledWith('updateLiturgy', ['foo'])
  expect(manager.sendMessage).toHaveBeenCalledWith('updateSongs', ['bar'])
})

it('sendMessage()', () => {
  const manager = new SlideshowWindowManager()

  manager.open()
  manager.sendMessage('foo', ['bar', 'baz'])

  expect(manager.window.postMessage).toHaveBeenCalledWith(
    { namespace: 'reveal', method: 'foo', args: ['bar', 'baz'] },
    '*',
  )
})

it('setLiturgy()', () => {
  const manager = new SlideshowWindowManager()
  manager.sendMessage = vi.fn()
  manager.setLiturgy('foo')

  expect(manager.liturgy).toEqual('foo')
  expect(manager.sendMessage).toHaveBeenCalledWith('updateLiturgy', ['foo'])
})

it('setSongs()', () => {
  const manager = new SlideshowWindowManager()
  manager.sendMessage = vi.fn()
  manager.setSongs('foo')

  expect(manager.songs).toEqual('foo')
  expect(manager.sendMessage).toHaveBeenCalledWith('updateSongs', ['foo'])
})
