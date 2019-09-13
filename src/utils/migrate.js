import range from "lodash/range";
import chunk from "lodash/chunk";
import flatten from "lodash/flatten";
import { currentVersion } from "../config/global";

function migrateToVersion2(doc) {
  return {
    ...doc,
    version: 2,
    blocks: doc.blocks.map(block => {
      if (block.title) {
        return block;
      }

      let title;
      switch (block.type) {
        case "announcements":
          title = "Annonces";
          break;
        case "reading":
          title = block.data.title;
          break;
        case "songs":
          title = "Chants";
          break;
        case "sermon":
          title = "Prédication";
          break;
        case "section":
          title = null;
          break;
        default:
          title = "";
      }

      return { ...block, title };
    })
  };
}

function migrateToVersion3(doc) {
  return {
    ...doc,
    blocks: doc.blocks.map(block => {
      if (block.type !== "announcements") {
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
        [[], []]
      );
      data = [...data[0], ...data[1]];

      return { ...block, data };
    })
  };
}

const functions = {
  migrateToVersion2,
  migrateToVersion3
};

export default function migrate(doc) {
  const { version = 1 } = doc;

  return range(version, currentVersion).reduce((acc, curr) => {
    const funcName = `migrateToVersion${curr + 1}`;

    if (functions[funcName]) {
      return functions[funcName](acc);
    }

    return acc;
  }, doc);
}
