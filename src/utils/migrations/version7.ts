import { omit } from 'lodash';

export default function migrate(doc: any) {
  return {
    ...doc,
    blocks: doc.blocks.map((block: any) => {
      switch (block.type) {
        case 'reading':
          // eslint-disable-next-line no-param-reassign
          block.data.bibleRefs = block.data.bibleRefs.map((ref: {}) =>
            omit(ref, 'template'),
          );
          break;

        default:
      }

      return block;
    }),
  };
}
