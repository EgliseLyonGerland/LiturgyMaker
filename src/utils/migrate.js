import range from 'lodash/range';
import chunk from 'lodash/chunk';
import omit from 'lodash/omit';
import { currentVersion } from '../config/global';

function migrateToVersion2(doc) {
  return {
    ...doc,
    version: 2,
    blocks: doc.blocks.map((block) => {
      if (block.title) {
        return block;
      }

      let title;
      switch (block.type) {
        case 'announcements':
          title = 'Annonces';
          break;
        case 'reading':
          title = block.data.title;
          break;
        case 'songs':
          title = 'Chants';
          break;
        case 'sermon':
          title = 'Prédication';
          break;
        case 'section':
          title = null;
          break;
        default:
          title = '';
      }

      return { ...block, title };
    }),
  };
}

function migrateToVersion3(doc) {
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

function migrateToVersion4(doc) {
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

function migrateToVersion5(doc) {
  return {
    ...doc,
    blocks: doc.blocks.map((block) => {
      const result = omit(block, 'id');

      if (!result.title) {
        result.title = '';
      }
      if (block.type === 'sermon') {
        block.data.plan = block.data.plan.map((text) => ({ text }));
        block.data.bibleRefs = block.data.bibleRefs.map((ref) => ({ ref }));
      }
      if (block.type === 'openDoors') {
        block.data.prayerTopics = block.data.prayerTopics.map((text) => ({
          text,
        }));
      }

      return result;
    }),
  };
}

const functions = {
  migrateToVersion2,
  migrateToVersion3,
  migrateToVersion4,
  migrateToVersion5,
};

export default function migrate(doc) {
  const { version = 1 } = doc;

  return range(version, currentVersion).reduce((acc, curr) => {
    const funcName = `migrateToVersion${curr + 1}`;

    if (functions[funcName]) {
      const result = functions[funcName](acc);
      result.version = curr + 1;

      return result;
    }

    return acc;
  }, doc);
}
