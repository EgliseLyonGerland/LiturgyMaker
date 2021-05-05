import omit from 'lodash/omit';

export default function migrate(doc) {
  return {
    ...doc,
    blocks: doc.blocks.map((block) => {
      if (block.type === 'reading') {
        return block;
      }

      return omit(block, 'title');
    }),
  };
}
