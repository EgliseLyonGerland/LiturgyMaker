import { omit } from 'lodash';

export default function migrate(doc) {
  return {
    ...doc,
    blocks: doc.blocks.map((block) => {
      switch (block.type) {
        case 'reading':
          block.data.bibleRefs = block.data.bibleRefs.map((ref) =>
            omit(ref, 'template'),
          );
          break;

        default:
      }

      return block;
    }),
  };
}
