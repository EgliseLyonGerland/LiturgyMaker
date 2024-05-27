import { expect, it } from 'vitest'

import { format, parse } from '../lyrics'

it('parse() starts by a verse', () => {
  const text = `
[verse]
Foobar
`

  expect(parse(text)).toEqual([
    {
      text: 'Foobar',
      type: 'verse',
    },
  ])
})

it('parse() starts by a chorus', () => {
  const text = `
[chorus]
Foobar
`

  expect(parse(text)).toEqual([
    {
      text: 'Foobar',
      type: 'chorus',
    },
  ])
})

it('parse() without tag', () => {
  const text = `
Foobar

Barfoo
`

  expect(parse(text)).toEqual([
    {
      text: 'Foobar',
      type: 'verse',
    },
    {
      text: 'Barfoo',
      type: 'verse',
    },
  ])
})

it('parse() empty', () => {
  const text = `

`

  expect(parse(text)).toEqual([])
})

it('format() with trailingBreak removed', () => {
  const lyrics = [
    {
      text: `${`
Exercitation ullamco enim occaecat nostrud mollit
    Nostrud pariatur mollit incididunt ut

Consequat sunt eu magna enim cupidatat
Excepteur Lorem labore officia ipsum commodo ea in laborum
      `.trim()}\n`,
      type: 'verse',
    },
    {
      text: `
Cillum duis dolor eu ex ut
Labore exercitation esse cupidatat
Sint eiusmod occaecat veniam irure
Non est et labore exercitation esse.
Anim eiusmod Lorem occaecat veniam est
Veniam anim adipisicing cillum tempor
Nostrud occaecat duis commodo do
Excepteur fugiat sit deserunt non consectetur
      `.trim(),
      type: 'verse',
    },
    {
      text: `
      `,
      type: 'verse',
    },
  ]

  expect(format(lyrics)).toEqual([
    {
      text: `
Exercitation ullamco enim occaecat nostrud mollit
Nostrud pariatur mollit incididunt ut
Consequat sunt eu magna enim cupidatat
Excepteur Lorem labore officia ipsum commodo ea in laborum
      `.trim(),
      type: 'verse',
    },
    {
      text: `
Cillum duis dolor eu ex ut
Labore exercitation esse cupidatat
Sint eiusmod occaecat veniam irure
Non est et labore exercitation esse.
Anim eiusmod Lorem occaecat veniam est
Veniam anim adipisicing cillum tempor
      `.trim(),
      type: 'verse',
    },
    {
      text: `
Nostrud occaecat duis commodo do
Excepteur fugiat sit deserunt non consectetur
      `.trim(),
      type: 'verse',
    },
  ])
})
