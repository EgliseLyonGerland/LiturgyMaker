import range from "lodash/range";
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

const functions = { migrateToVersion2 };

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
