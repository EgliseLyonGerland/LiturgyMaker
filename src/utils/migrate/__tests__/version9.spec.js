import { expect } from 'vitest'

import { uid } from 'uid'
import version9 from '../version9'

vi.mock('uid')

uid.mockImplementation(() => '123456')

const input = {
  id: '20220102',
  uid: 'bwz1t2xiOUdodt9p0gz6NGoTMRr2',
  date: 1641114000000,
  version: 6,
  blocks: [
    {
      data: {
        bibleRefs: [
          {
            id: 'Malachie 3.6',
            excerpt: '« Car je suis l’Éternel, je ne change pas »',
          },
          {
            id: 'Galates 1.3-5',
            excerpt:
              'Que la grâce et la paix vous soient données de la part de Dieu le Père et de notre Seigneur Jésus-Christ',
          },
        ],
      },
      title: 'Ouverture',
      type: 'reading',
    },
    {
      data: {
        author: 'Alexandre Sarran',
        bibleRefs: [
          {
            id: 'Matthieu 5.17-48',
          },
        ],
        title: 'Soyez donc parfaits !',
        plan: [
          {
            text: 'Jésus promeut la loi (v. 17-20)',
          },
          {
            text: 'Jésus complète la loi (v. 21-47)',
          },
          {
            text: 'Jésus réalise la loi (v. 48)',
          },
        ],
      },
      type: 'sermon',
      title: '',
    },
  ],
}

const output = {
  id: '20220102',
  uid: 'bwz1t2xiOUdodt9p0gz6NGoTMRr2',
  date: 1641114000000,
  version: 6,
  blocks: [
    {
      id: '123456',
      data: {
        bibleRefs: [
          {
            id: 'Malachie 3.6',
            excerpt: '« Car je suis l’Éternel, je ne change pas »',
          },
          {
            id: 'Galates 1.3-5',
            excerpt:
              'Que la grâce et la paix vous soient données de la part de Dieu le Père et de notre Seigneur Jésus-Christ',
          },
        ],
      },
      title: 'Ouverture',
      type: 'reading',
    },
    {
      id: '123456',
      data: {
        author: 'Alexandre Sarran',
        bibleRefs: [
          {
            id: 'Matthieu 5.17-48',
          },
        ],
        title: 'Soyez donc parfaits !',
        plan: [
          {
            text: 'Jésus promeut la loi (v. 17-20)',
          },
          {
            text: 'Jésus complète la loi (v. 21-47)',
          },
          {
            text: 'Jésus réalise la loi (v. 48)',
          },
        ],
      },
      type: 'sermon',
      title: '',
    },
  ],
}

it('version9()', () => {
  expect(version9(input)).toEqual(output)
})
