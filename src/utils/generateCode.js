import find from 'lodash/find';
import upperFirst from 'lodash/upperFirst';

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
  if (!data.items.length) {
    return '';
  }

  const config = {
    items: data.items.reduce((acc, { title, detail }) => {
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

function generateSongsBlockCode({ data }, { songs, addError }) {
  return data.items
    .reduce((acc, datum) => {
      let song = find(songs, ['id', datum.id]);

      if (!song) {
        addError(`Unable to find song "${datum.id}"`);
        return acc;
      }

      if (song.lyrics.length === 0) {
        addError(`Song "${song.title}" (${song.id}) has no lyric`);
        return acc;
      }

      song = {
        title: song.title,
        aka: song.aka || '',
        authors: song.authors || '',
        copyright: song.copyright || '',
        collection: song.collection || '',
        translation: song.translation || '',
        repeat: !!song.repeat,
        background: 'green',
      };

      changeBackground();

      return [
        ...acc,
        [
          `// ${datum.id}`,
          `createSongSlide(${JSON.stringify(song, null, 2)})`,
        ].join('\n'),
      ];
    }, [])
    .join('\n\n');
}

function generateRecitationBlockCode({ data }, { recitations, addError }) {
  const recitation = find(recitations, ['id', data.id]);

  if (!recitation) {
    return addError(`Unable to find recitation "${data.id}"`);
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
    config.bibleRef = bibleRefs[0].ref;
  }

  if (plan.length) {
    config.plan = plan.map((item) => item.text);
  }

  return `createSermonSlide(${JSON.stringify(config, 2, '  ')})`;
}

function generateOpenDoorsBlockCode({ data }) {
  const { title, detail, prayerTopics = [] } = data;

  if (!title || !detail) {
    return '';
  }

  const config = {
    title,
    detail,
    prayerTopics: prayerTopics.map((topic) => topic.text),
  };

  return `createOpenDoorsSlide(${JSON.stringify(config, 2, '  ')})`;
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
  generateOpenDoorsBlockCode,
};

function generateErrors(errors) {
  return errors
    .map((error) => `throw new Error("${error.replace(/"/gm, '\\"')}")`)
    .join('\n');
}

export default function generateCode(doc, { songs, recitations }) {
  currentSongBackground = 'blue';

  let code = '';
  const errors = [];

  const addError = (msg) => {
    errors.push(msg);
  };

  doc.blocks.forEach((block) => {
    const funcName = `generate${upperFirst(block.type)}BlockCode`;

    if (functions[funcName]) {
      code += '\n\n';
      code += functions[funcName](block, { songs, recitations, addError });
    }

    code = code.trim();
  });

  code += '\n\n';
  code += generateGoodbyeBlockCode();
  code = `${generateErrors(errors)}\n\n${code}`.trim();

  return code;
}
