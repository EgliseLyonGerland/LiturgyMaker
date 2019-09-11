import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import capitalize from "lodash/capitalize";
import throttle from "lodash/throttle";
import { useWindowEvent } from "@culturehq/hooks";
import animateScrollTo from "animated-scroll-to";

import Block from "./FormBlock";
import AnnouncementsBlock from "./blocks/AnnouncementsBlock";
import SongsBlock from "./blocks/SongsBlock";
import ReadingBlock from "./blocks/ReadingBlock";
import SermonBlock from "./blocks/SermonBlock";
import SectionBlock from "./blocks/SectionBlock";

const useStyles = makeStyles(
  theme => ({
    root: {
      position: "relative"
    },
    divider: {
      height: 1,
      backgroundImage:
        "linear-gradient(to right, #ccc 40%, rgba(255,255,255,0) 0%)",
      backgroundPosition: "bottom",
      backgroundSize: [[15, 1]],
      backgroundRepeat: "repeat-x"
    },
    activeMarker: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 4,
      background: theme.palette.secondary.main
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

export default ({ blocks, onChange, onFocus, onBlur }) => {
  const classes = useStyles();
  const container = useRef(null);
  const activeMarker = useRef(null);
  const currentIndex = useRef(0);
  const scrolling = useRef(false);

  const handleScroll = useRef(
    throttle(() => {
      if (scrolling.current) {
        return;
      }

      const { childNodes } = container.current;
      const defaultThreshold = 176;

      let index = 0;
      let currentHeight = childNodes[0].getBoundingClientRect().height;
      let currentPosition = 0;
      let nextPosition = 0;

      for (; index < childNodes.length; index++) {
        const { height, top } = childNodes[index].getBoundingClientRect();

        if (top > defaultThreshold) {
          break;
        }

        currentHeight = height;
        currentPosition = nextPosition;
        nextPosition += currentHeight;
      }

      activeMarker.current.style.height = `${currentHeight}px`;
      activeMarker.current.style.transform = `translateY(${currentPosition}px)`;
      currentIndex.current = index - 1;

      onFocus(blocks[currentIndex.current]);
    }, 100)
  );

  const handleFocus = (block, path, index) => {
    if (index === currentIndex.current) {
      return;
    }

    onFocus(block, path);

    const { childNodes } = container.current;

    scrolling.current = true;
    animateScrollTo(childNodes[index], {
      speed: 1000,
      offset: -48,
      onComplete: () => {
        scrolling.current = false;
      }
    });
  };

  useWindowEvent("scroll", handleScroll.current);
  useEffect(() => {
    handleScroll.current();
  }, [blocks]);

  const renderBlock = (block, index) => {
    const Component = components[`${capitalize(block.type)}Block`];

    return (
      <Block title={block.title}>
        <Component
          block={block}
          onChange={data => {
            blocks[index].data = data;
            onChange([...blocks]);
          }}
          onFocus={path => {
            handleFocus(block, path, index);
          }}
          onBlur={onBlur}
        />
      </Block>
    );
  };

  const renderDivider = () => {
    return <div className={classes.divider} />;
  };

  return (
    <div className={classes.root}>
      <div ref={activeMarker} className={classes.activeMarker} />
      <div ref={container}>
        {blocks.map((block, index) => (
          <div key={block.id}>
            {renderBlock(block, index)}
            {index + 1 < blocks.length && renderDivider()}
          </div>
        ))}
      </div>
    </div>
  );
};
