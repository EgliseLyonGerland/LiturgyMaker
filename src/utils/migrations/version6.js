export default function migrate(doc) {
  return {
    ...doc,
    blocks: doc.blocks.map((block) => {
      switch (block.type) {
        case 'announcements':
        case 'songs':
          block.data = {
            items: block.data,
          };
          break;

        default:
      }

      return block;
    }),
  };
}
