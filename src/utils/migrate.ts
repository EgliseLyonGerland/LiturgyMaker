import range from 'lodash/range';

import { currentVersion } from '../config/global';
import type { LiturgyDocument } from '../types';
import version2 from './migrations/version2';
import version3 from './migrations/version3';
import version4 from './migrations/version4';
import version5 from './migrations/version5';
import version6 from './migrations/version6';
import version7 from './migrations/version7';

function toVersion(version: number, data: any) {
  switch (version) {
    case 2:
      return version2(data);
    case 3:
      return version3(data);
    case 4:
      return version4(data);
    case 5:
      return version5(data);
    case 6:
      return version6(data);
    case 7:
      return version7(data);
    default:
      return data;
  }
}

export default function migrate(doc: LiturgyDocument) {
  const { version = 1 } = doc;

  return range(version, currentVersion).reduce((acc, curr) => {
    return toVersion(curr + 1, acc);
  }, doc);
}
