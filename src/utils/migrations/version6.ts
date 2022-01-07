export default function migrate(doc: any) {
  return {
    ...doc,
    blocks: doc.blocks.map((block: any) => {
      switch (block.type) {
        case 'announcements':
        case 'songs':
          // eslint-disable-next-line no-param-reassign
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
