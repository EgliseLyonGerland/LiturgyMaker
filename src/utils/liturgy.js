import every from 'lodash/every';
import { isValid as isRefValid } from './bibleRef';

const validators = {
  reading: ({ data }) =>
    every(data.bibleRefs, ({ ref }) => !ref || isRefValid(ref)),
  sermon: ({ data }) => every(data.bibleRefs, (ref) => !ref || isRefValid(ref)),
};

export function validate(liturgy) {
  return every(liturgy.blocks, (block) => {
    if (!validators[block.type]) {
      return true;
    }

    return validators[block.type](block);
  });
}

export default null;
