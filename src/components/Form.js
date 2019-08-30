import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import uuid from "uuid/v1";
import classnames from "classnames";

import AnnouncementsBlock from "./blocks/AnnouncementsBlock";
import SongsBlock from "./blocks/SongsBlock";
import ReadingBlock from "./blocks/ReadingBlock";
import SermonBlock from "./blocks/SermonBlock";

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
    data: []
  },
  {
    id: uuid(),
    type: "reading",
    data: {
      title: "Ouverture"
    }
  },
  {
    id: uuid(),
    type: "songs",
    data: []
  },
  {
    id: uuid(),
    type: "reading",
    data: {
      title: "Loi de Dieu"
    }
  },
  {
    id: uuid(),
    type: "songs",
    data: []
  },
  {
    id: uuid(),
    type: "reading",
    data: {
      title: "Grâce de Dieu"
    }
  },
  {
    id: uuid(),
    type: "songs",
    data: []
  },
  {
    id: uuid(),
    type: "sermon",
    data: {}
  },
  {
    id: uuid(),
    type: "songs",
    data: []
  },
  {
    id: uuid(),
    type: "reading",
    data: {
      title: "Envois"
    }
  }
];

const components = {
  AnnouncementsBlock,
  SongsBlock,
  ReadingBlock,
  SermonBlock
};

export default ({ firebase }) => {
  const classes = useStyles();
  const [blocks, setBlocks] = useState(defaultBlocks);

  const renderBlock = (block, index) => {
    const Component = components[`${_.capitalize(block.type)}Block`];

    return (
      <Component
        block={block}
        onChange={data => {
          blocks[index].data = data;
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
