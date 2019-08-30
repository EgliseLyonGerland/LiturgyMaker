import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import uuid from "uuid/v1";
import classnames from "classnames";

import AnnouncementsBlock from "./blocks/AnnouncementsBlock";
import SongsBlock from "./blocks/SongsBlock";
import ReadingBlock from "./blocks/ReadingBlock";

const useStyles = makeStyles(theme => ({
  root: {},
  block: {
    padding: theme.spacing(6, 8)
  },
  odd: {
    background: "#F5F5F5"
  },
  divider: {
    height: 1,
    backgroundImage:
      "linear-gradient(to right, #ccc 40%, rgba(255,255,255,0) 0%)",
    backgroundPosition: "bottom",
    backgroundSize: [[15, 1]],
    backgroundRepeat: "repeat-x"
  }
}));

const defaultBlocks = [
  {
    id: uuid(),
    type: "announcements",
    value: []
  },
  {
    id: uuid(),
    type: "reading",
    title: "Ouverture",
    value: [
      // {
      //   bibleRef: "Ésaïe 55.1-3a",
      //   excerpt: "Ô vous tous qui avez soif, venez vers les eaux."
      // }
    ]
  },
  {
    id: uuid(),
    type: "songs",
    value: []
  },
  {
    id: uuid(),
    type: "reading",
    title: "Loi de Dieu",
    value: []
  },
  {
    id: uuid(),
    type: "songs",
    value: []
  },
  {
    id: uuid(),
    type: "reading",
    value: {
      title: "Grâce de Dieu",
      biblesRefs: []
    }
  },
  {
    id: uuid(),
    type: "songs",
    value: []
  }
];

const components = {
  AnnouncementsBlock,
  SongsBlock,
  ReadingBlock
};

export default ({ firebase }) => {
  const classes = useStyles();
  const [blocks, setBlocks] = useState(defaultBlocks);

  const renderBlock = (block, index) => {
    const Component = components[`${_.capitalize(block.type)}Block`];

    return (
      <Component
        block={block}
        onChange={value => {
          blocks[index].value = value;
          setBlocks([...blocks]);
        }}
      />
    );
  };

  const renderDivider = () => {
    return <div className={classes.divider} />;
  };

  return (
    <div className={classes.root}>
      {blocks.map((block, index) => (
        <Fragment key={block.id}>
          <div
            className={classnames(classes.block, {
              [classes.odd]: index % 2
            })}
          >
            {renderBlock(block, index)}
          </div>
          {index + 1 < blocks.length && renderDivider()}
        </Fragment>
      ))}
    </div>
  );
};
