import capitalize from 'lodash/capitalize';
import slugify from './slugify';

function generateAnnouncementsBlockCode({ data }) {
  if (!data.length) {
    return '';
  }

  const config = {
    items: data.reduce((acc, { title, detail }) => {
      if (!title) {
        return acc;
      }

      return [...acc, { title, detail }];
    }, []),
  };

  if (!config.items.length) {
    return '';
  }

  return `createAnnouncementSlide(${JSON.stringify(config, null, '  ')})`;
}

function generateSongsBlockCode({ data }) {
  return data
    .reduce((acc, datum) => {
      const [title] = datum.title.split('(');
      const args = [`'${slugify(title)}'`];

      if (datum.repeat) {
        args.push(`{ repeat: true }`);
      }

      return [...acc, `createSongSlide(${args.join(', ')})`];
    }, [])
    .join('\n');
}

function generateReadingBlockCode({ data }) {
  const { bibleRefs = [] } = data;

  return bibleRefs
    .reduce((acc, bibleRef) => {
      if (!bibleRef.excerpt) {
        return acc;
      }

      const config = {
        bibleRef: bibleRef.ref,
        excerpt: bibleRef.excerpt,
        template: bibleRef.template || 'topBottomLeft',
      };

      return [
        ...acc,
        `createVerseSlide(${JSON.stringify(config, null, '  ')})`,
      ];
    }, [])
    .join('\n\n');
}

function generateSectionBlockCode(block) {
  return `createChapterSlide({ title: '${block.data.title}' })`;
}

function generateSermonBlockCode({ data }) {
  const { title, author, plan = [], bibleRefs = [] } = data;

  if (!author || !bibleRefs.length) {
    return '';
  }

  const config = {};

  if (title) {
    config.title = title;
  }

  if (author) {
    config.author = author;
  }

  if (bibleRefs.length) {
    [config.bibleRef] = bibleRefs;
  }

  if (plan.length && plan.join('')) {
    config.plan = plan;
  }

  return `createSermonSlide(${JSON.stringify(config, 2, '  ')})`;
}

function generateGoodbyeBlockCode() {
  return `createGoodbyeSlide()`;
}

const functions = {
  generateAnnouncementsBlockCode,
  generateSongsBlockCode,
  generateReadingBlockCode,
  generateSectionBlockCode,
  generateSermonBlockCode,
};

export default function generateCode(doc) {
  let code = '';

  doc.blocks.forEach(block => {
    const funcName = `generate${capitalize(block.type)}BlockCode`;

    if (functions[funcName]) {
      code += '\n\n';
      code += functions[funcName](block);
    }

    code = code.trim();
  });

  code += '\n\n';
  code += generateGoodbyeBlockCode();

  return code;
}
