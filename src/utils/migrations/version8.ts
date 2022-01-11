import { omit } from 'lodash';

export default function migrate(doc: any) {
  return {
    ...doc,
    blocks: doc.blocks.map((block: any) => {
      switch (block.type) {
        case 'reading':
        case 'sermon':
          // eslint-disable-next-line no-param-reassign
          block.data.bibleRefs = block.data.bibleRefs.map(
            (ref: { ref: string }) => ({
              ...omit(ref, 'ref'),
              id: ref.ref,
            }),
          );
          break;

        default:
      }

      return block;
    }),
  };
}
