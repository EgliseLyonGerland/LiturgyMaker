import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import capitalize from "lodash/capitalize";
import classnames from "classnames";

import AnnouncementsBlock from "./blocks/AnnouncementsBlock";
import SongsBlock from "./blocks/SongsBlock";
import ReadingBlock from "./blocks/ReadingBlock";
import SermonBlock from "./blocks/SermonBlock";
import SectionBlock from "./blocks/SectionBlock";

const useStyles = makeStyles(
  theme => ({
    root: {},
    block: {
      padding: theme.spacing(6, 8)
    },
    odd: {
    },
    divider: {
      height: 1,
      backgroundImage:
        "linear-gradient(to right, #ccc 40%, rgba(255,255,255,0) 0%)",
      backgroundPosition: "bottom",
      backgroundSize: [[15, 1]],
      backgroundRepeat: "repeat-x"
    }
  }),
  { name: "Form" }
);

const components = {
  AnnouncementsBlock,
  SongsBlock,
  ReadingBlock,
  SermonBlock,
  SectionBlock
};

export default ({ blocks, onChange }) => {
  const classes = useStyles();

  const renderBlock = (block, index) => {
    const Component = components[`${capitalize(block.type)}Block`];

    return (
      <Component
        block={block}
        onChange={data => {
          blocks[index].data = data;
          onChange([...blocks]);
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
