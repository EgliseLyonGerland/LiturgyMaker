import range from 'lodash/range';

import { currentVersion } from '../config/global';
import * as functions from './migrations';

export default function migrate(doc) {
  const { version = 1 } = doc;

  return range(version, currentVersion).reduce((acc, curr) => {
    const funcName = `version${curr + 1}`;

    if (functions[funcName]) {
      const result = functions[funcName](acc);
      result.version = curr + 1;

      return result;
    }

    return acc;
  }, doc);
}
