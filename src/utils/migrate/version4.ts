import omit from "lodash/omit";

export default function migrate(doc: any) {
  return {
    ...doc,
    blocks: doc.blocks.map((block: any) => {
      if (block.type === "reading") {
        return block;
      }

      return omit(block, "title");
    }),
  };
}
