import range from 'lodash/range'

import { currentVersion } from '../../config/global'
import type { LiturgyDocument } from '../../types'
import version2 from './version2'
import version3 from './version3'
import version4 from './version4'
import version5 from './version5'
import version6 from './version6'
import version7 from './version7'
import version8 from './version8'

function toVersion(version: number, data: any) {
  switch (version) {
    case 2:
      return version2(data)
    case 3:
      return version3(data)
    case 4:
      return version4(data)
    case 5:
      return version5(data)
    case 6:
      return version6(data)
    case 7:
      return version7(data)
    case 8:
      return version8(data)
    default:
      return data
  }
}

export default function migrate(doc: LiturgyDocument) {
  const { version = 1 } = doc

  if (version >= currentVersion) {
    return doc
  }

  const result = range(version, currentVersion).reduce((acc, curr) => {
    return toVersion(curr + 1, acc)
  }, doc)

  result.version = currentVersion

  return result
}
