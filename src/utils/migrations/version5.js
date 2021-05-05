import omit from 'lodash/omit';

export default function migrate(doc) {
  return {
    ...doc,
    blocks: doc.blocks.map((block) => {
      const result = omit(block, 'id');

      if (!result.title) {
        result.title = '';
      }
      switch (block.type) {
        case 'sermon':
          result.data.plan = result.data.plan.map((text) => ({ text }));
          result.data.bibleRefs = result.data.bibleRefs.map((ref) => ({ ref }));
          break;
        case 'openDoors':
          result.data.prayerTopics = result.data.prayerTopics.map((text) => ({
            text,
          }));
          break;
        default:
      }

      return result;
    }),
  };
}
