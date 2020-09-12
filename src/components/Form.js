import React, { useRef, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import upperFirst from 'lodash/upperFirst';
import throttle from 'lodash/throttle';
import toArray from 'lodash/toArray';
import { useWindowEvent } from '@culturehq/hooks';
import animateScrollTo from 'animated-scroll-to';
import classnames from 'classnames';

import Block from './FormBlock';
import Divider from './Divider';
import AnnouncementsBlock from './blocks/AnnouncementsBlock';
import SongsBlock from './blocks/SongsBlock';
import ReadingBlock from './blocks/ReadingBlock';
import SermonBlock from './blocks/SermonBlock';
import SectionBlock from './blocks/SectionBlock';
import RecitationBlock from './blocks/RecitationBlock';
import OpenDoorsBlock from './blocks/OpenDoorsBlock';
import { createDefaultBlock } from '../utils/defaults';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: 'relative',
      padding: theme.spacing(8, 0),
    },
    block: {
      borderLeft: [['solid', 4, 'transparent']],
    },
    active: {
      borderColor: theme.palette.secondary.main,
    },
  }),
  { name: 'Form' },
);

const components = {
  AnnouncementsBlock,
  SongsBlock,
  ReadingBlock,
  SermonBlock,
  SectionBlock,
  RecitationBlock,
  OpenDoorsBlock,
};

const Form = ({
  blocks,
  activedIndex,
  focusedIndex,
  onChange,
  onFocus,
  onBlur,
  onActive,
  onAddBlock,
  onFillFromLastWeek,
}) => {
  const classes = useStyles();
  const container = useRef(null);
  const activeMarker = useRef(null);
  const scrolling = useRef(false);
  const currentIndex = focusedIndex >= 0 ? focusedIndex : activedIndex;

  const handleScroll = useRef(
    throttle((focused) => {
      if (focused || scrolling.current) {
        return;
      }

      const { childNodes } = container.current;
      const defaultThreshold = 176;

      const activeIndex = toArray(childNodes)
        .filter((childNode) => childNode.className.includes(classes.block))
        .reduce((acc, childNode, index) => {
          const { top } = childNode.getBoundingClientRect();

          if (top > defaultThreshold) {
            return acc;
          }

          return index;
        }, 0);

      onActive(activeIndex);
    }, 300),
  );

  const handleFocus = (block, path, index) => {
    const { childNodes } = container.current;
    const blockChildNodes = toArray(childNodes).filter((childNode) =>
      childNode.className.includes(classes.block),
    );

    scrolling.current = true;
    animateScrollTo(blockChildNodes[index], {
      speed: 1000,
      offset: -48,
    }).then(() => {
      onFocus(index, path);
      scrolling.current = false;
    });
  };

  const handleBlur = () => {
    onBlur();
    scrolling.current = false;
  };

  useWindowEvent('scroll', () => {
    handleScroll.current(focusedIndex >= 0);
  });

  useEffect(() => {
    handleScroll.current(focusedIndex >= 0);
  }, [blocks, focusedIndex, activedIndex, container]);

  const renderBlock = (block, index) => {
    const Component = components[`${upperFirst(block.type)}Block`];

    return (
      <Block
        block={block}
        onFillFromLastWeekClicked={() => onFillFromLastWeek(index)}
      >
        <Component
          block={block}
          onChange={(data) => {
            const newBlocks = blocks;
            newBlocks[index] = { ...newBlocks[index], data };
            onChange(newBlocks);
          }}
          onFocus={(path) => {
            handleFocus(block, path, index);
          }}
          onBlur={handleBlur}
        />
      </Block>
    );
  };

  const renderDivider = (index) => {
    return (
      <Divider
        onBlockSelected={(type) => {
          onAddBlock(index, createDefaultBlock(type));
        }}
      />
    );
  };

  return (
    <div className={classes.root}>
      <div ref={activeMarker} className={classes.activeMarker} />
      <div ref={container}>
        {renderDivider(0)}

        {blocks.map((block, index) => (
          <Fragment key={block.id}>
            <div
              className={classnames(classes.block, {
                [classes.active]: currentIndex === index,
              })}
            >
              {renderBlock(block, index)}
            </div>

            {renderDivider(index + 1)}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

Form.propTypes = {
  blocks: PropTypes.array,
  activedIndex: PropTypes.number,
  focusedIndex: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onActive: PropTypes.func,
  onAddBlock: PropTypes.func,
  onFillFromLastWeek: PropTypes.func,
};

export default Form;
