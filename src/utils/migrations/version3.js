import chunk from 'lodash/chunk';

export default function migrate(doc) {
  return {
    ...doc,
    blocks: doc.blocks.map((block) => {
      if (block.type !== 'announcements') {
        return block;
      }

      let { data = [] } = block;

      data = chunk(data, 2);
      data = data.reduce(
        (acc, curr) => {
          acc[0].push(curr[0]);

          if (curr[1]) {
            acc[1].push(curr[1]);
          }

          return acc;
        },
        [[], []],
      );
      data = [...data[0], ...data[1]];

      return { ...block, data };
    }),
  };
}
