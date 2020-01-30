import capitalize from 'lodash/capitalize';
import find from 'lodash/find';
import omit from 'lodash/omit';

let currentSongBackground = 'blue';

function changeBackground() {
  if (currentSongBackground === 'blue') {
    currentSongBackground = 'red';
  } else if (currentSongBackground === 'red') {
    currentSongBackground = 'green';
  } else {
    currentSongBackground = 'blue';
  }
}

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

function generateSongsBlockCode({ data }, { songs }) {
  return data
    .reduce((acc, datum) => {
      let song = find(songs, ['id', datum.id]);

      if (!song) {
        return [...acc, `throw new Error('Unable to find song "${datum.id}"')`];
      }

      song = {
        title: song.title,
        ...omit(song, ['id', 'number', 'lyrics']),
        repeat: datum.repeat,
        background: currentSongBackground,
        lyrics: song.lyrics,
      };

      changeBackground();

      return [...acc, `createSongSlide(${JSON.stringify(song, null, 2)})`];
    }, [])
    .join('\n\n');
}

function generateRecitationBlockCode({ data }, { recitations }) {
  const recitation = find(recitations, ['id', data.id]);

  if (!recitation) {
    return `throw new Error('Unable to find recitation "${data.id}"')`;
  }
  const arg = {
    title: recitation.title,
    background: currentSongBackground,
    lyrics: recitation.content.map(({ text, italic = false }) => ({
      type: italic ? 'chorus' : 'verse',
      text,
    })),
  };

  changeBackground();

  return `createSongSlide(${JSON.stringify(arg, null, 2)})`;
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
  generateRecitationBlockCode,
};

export default function generateCode(doc, { songs, recitations }) {
  currentSongBackground = 'blue';

  let code = '';

  doc.blocks.forEach(block => {
    const funcName = `generate${capitalize(block.type)}BlockCode`;

    if (functions[funcName]) {
      code += '\n\n';
      code += functions[funcName](block, { songs, recitations });
    }

    code = code.trim();
  });

  code += '\n\n';
  code += generateGoodbyeBlockCode();

  return code;
}
