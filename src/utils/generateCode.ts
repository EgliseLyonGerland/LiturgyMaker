import find from 'lodash/find';

import type {
  AnnouncementsBlockData,
  LiturgyBlock,
  LiturgyDocument,
  OpenDoorsBlockData,
  ReadingBlockData,
  RecitationBlockData,
  RecitationDocument,
  SectionBlockData,
  SermonBlockData,
  SongDocument,
  SongsBlockData,
} from '../types';

interface GeneratorProps<T extends LiturgyBlock['data']> {
  data: T;
  songs: SongDocument[];
  recitations: RecitationDocument[];
  addError: (message: string) => void;
}

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

function generateAnnouncementsBlockCode({
  data,
}: GeneratorProps<AnnouncementsBlockData>): string {
  if (!data.items.length) {
    return '';
  }

  const config = {
    items: data.items.reduce<{ title: string; detail: string }[]>(
      (acc, { title, detail }) => {
        if (!title) {
          return acc;
        }

        return [...acc, { title, detail }];
      },
      [],
    ),
  };

  if (!config.items.length) {
    return '';
  }

  return `createAnnouncementSlide(${JSON.stringify(config, null, '  ')})`;
}

function generateSongsBlockCode({
  data,
  songs,
  addError,
}: GeneratorProps<SongsBlockData>): string {
  return data.items
    .reduce<string[]>((acc, datum) => {
      const song = find(songs, ['id', datum.id]);

      if (!song) {
        addError(`Unable to find song "${datum.id}"`);
        return acc;
      }

      if (song.lyrics.length === 0) {
        addError(`Song "${song.title}" (${song.id}) has no lyric`);
        return acc;
      }

      const obj = {
        title: song.title,
        aka: song.aka || '',
        authors: song.authors || '',
        copyright: song.copyright || '',
        collection: song.collection || '',
        translation: song.translation || '',
        repeat: !!datum.repeat,
        background: 'green',
        lyrics: song.lyrics,
      };

      changeBackground();

      return [
        ...acc,
        [
          `// ${datum.id}`,
          `createSongSlide(${JSON.stringify(obj, null, 2)})`,
        ].join('\n'),
      ];
    }, [])
    .join('\n\n');
}

function generateRecitationBlockCode({
  data,
  recitations,
  addError,
}: GeneratorProps<RecitationBlockData>): string {
  const recitation = find(recitations, ['id', data.id]);

  if (!recitation) {
    addError(`Unable to find recitation "${data.id}"`);
    return '';
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

function generateReadingBlockCode({
  data,
}: GeneratorProps<ReadingBlockData>): string {
  const { bibleRefs = [] } = data;

  return bibleRefs
    .reduce<string[]>((acc, bibleRef) => {
      if (!bibleRef.excerpt) {
        return acc;
      }

      const config = {
        bibleRef: bibleRef.id,
        excerpt: bibleRef.excerpt,
      };

      return [
        ...acc,
        `createVerseSlide(${JSON.stringify(config, null, '  ')})`,
      ];
    }, [])
    .join('\n\n');
}

function generateSectionBlockCode({
  data,
}: GeneratorProps<SectionBlockData>): string {
  return `createChapterSlide(${JSON.stringify(
    { title: data.title },
    null,
    '  ',
  )})`;
}

function generateSermonBlockCode({
  data,
}: GeneratorProps<SermonBlockData>): string {
  const { title, author, plan = [], bibleRefs = [] } = data;

  if (!author || !bibleRefs.length) {
    return '';
  }

  const config: Record<string, any> = {};

  if (title) {
    config.title = title;
  }

  if (author) {
    config.author = author;
  }

  if (bibleRefs.length) {
    config.bibleRef = bibleRefs[0].id;
  }

  if (plan.length) {
    config.plan = plan.map((item) => item.text);
  }

  return `createSermonSlide(${JSON.stringify(config, null, '  ')})`;
}

function generateOpenDoorsBlockCode({
  data,
}: GeneratorProps<OpenDoorsBlockData>) {
  const { title, detail, prayerTopics = [] } = data;

  if (!title || !detail) {
    return '';
  }

  const config = {
    title,
    detail,
    prayerTopics: prayerTopics.map((topic) => topic.text),
  };

  return `createOpenDoorsSlide(${JSON.stringify(config, null, '  ')})`;
}

function generateGoodbyeBlockCode() {
  return `createGoodbyeSlide()`;
}

function generateErrors(errors: string[]) {
  return errors
    .map((error) => `throw new Error("${error.replace(/"/gm, '\\"')}")`)
    .join('\n');
}

// @todo: remove this any
function generate(type: string, args: any) {
  switch (type) {
    case 'announcements':
      return generateAnnouncementsBlockCode(args);
    case 'songs':
      return generateSongsBlockCode(args);
    case 'reading':
      return generateReadingBlockCode(args);
    case 'section':
      return generateSectionBlockCode(args);
    case 'sermon':
      return generateSermonBlockCode(args);
    case 'recitation':
      return generateRecitationBlockCode(args);
    case 'openDoors':
      return generateOpenDoorsBlockCode(args);
    default:
      return null;
  }
}

export default function generateCode(
  doc: LiturgyDocument,
  {
    songs,
    recitations,
  }: { songs: SongDocument[]; recitations: RecitationDocument[] },
) {
  currentSongBackground = 'blue';

  let code = '';
  const errors: string[] = [];

  const addError = (msg: string) => {
    errors.push(msg);
  };

  doc.blocks.forEach((block) => {
    code += `\n\n${generate(block.type, {
      data: block.data,
      songs,
      recitations,
      addError,
    })}`;

    code = code.trim();
  });

  code += '\n\n';
  code += generateGoodbyeBlockCode();
  code = `${generateErrors(errors)}\n\n${code}`.trim();

  return code;
}
