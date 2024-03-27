import find from "lodash/find";

import type {
  LiturgyDocument,
  RecitationDocument,
  SongDocument,
  BlockType,
  SongsItem,
  LiturgyBlocks,
} from "../types";

const isEmpty: {
  [K in BlockType]?: (block: LiturgyBlocks[K]) => boolean;
} = {
  openDoors: (block) => {
    return block.data.title.trim() === "";
  },
};

function getSong(data: SongsItem, songs: SongDocument[]) {
  const song = find(songs, ["id", data.id])!;

  return { ...song, lyrics: data.lyrics || song.lyrics };
}

export default function generateCode(
  doc: LiturgyDocument,
  {
    songs,
    recitations,
  }: { songs: SongDocument[]; recitations: RecitationDocument[] },
) {
  const result = doc.blocks.reduce<unknown[]>((acc, block) => {
    const { type } = block;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (type in isEmpty && isEmpty?.[type]?.(block)) {
      return acc;
    }

    if (type === "songs") {
      return acc.concat(
        block.data.items.map((data) => ({
          type: "song",
          data: { ...data, ...getSong(data, songs) },
        })),
      );
    }

    if (type === "recitation") {
      return acc.concat({
        type: "recitation",
        data: find(recitations, ["id", block.data.id]),
      });
    }

    if (type === "reading") {
      return acc.concat(
        block.data.bibleRefs.map((data) => ({
          type: "verse",
          data,
        })),
      );
    }

    return acc.concat(block);
  }, []);

  return JSON.stringify(result, null, "  ");
}
