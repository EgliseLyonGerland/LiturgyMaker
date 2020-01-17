import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import capitalize from 'lodash/capitalize';
import throttle from 'lodash/throttle';
import { useWindowEvent } from '@culturehq/hooks';
import animateScrollTo from 'animated-scroll-to';
import classnames from 'classnames';

import Block from './FormBlock';
import AnnouncementsBlock from './blocks/AnnouncementsBlock';
import SongsBlock from './blocks/SongsBlock';
import ReadingBlock from './blocks/ReadingBlock';
import SermonBlock from './blocks/SermonBlock';
import SectionBlock from './blocks/SectionBlock';

const useStyles = makeStyles(
  theme => ({
    root: {
      position: 'relative',
    },
    divider: {
      height: 1,
      backgroundImage:
        'linear-gradient(to right, #ccc 40%, rgba(255,255,255,0) 0%)',
      backgroundPosition: 'bottom',
      backgroundSize: [[15, 1]],
      backgroundRepeat: 'repeat-x',
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
};

const Form = ({
  blocks,
  activedIndex,
  focusedIndex,
  onChange,
  onFocus,
  onBlur,
  onActive,
  onFillFromLastWeek,
}) => {
  const classes = useStyles();
  const container = useRef(null);
  const activeMarker = useRef(null);
  const scrolling = useRef(false);
  const currentIndex = focusedIndex >= 0 ? focusedIndex : activedIndex;

  const handleScroll = useRef(
    throttle(focused => {
      if (focused || scrolling.current) {
        return;
      }

      const { childNodes } = container.current;
      const defaultThreshold = 176;

      let index = 0;

      for (; index < childNodes.length; index += 1) {
        const { top } = childNodes[index].getBoundingClientRect();

        if (top > defaultThreshold) {
          break;
        }
      }

      onActive(index - 1);
    }, 100),
  );

  const handleFocus = (block, path, index) => {
    onFocus(index, path);

    const { childNodes } = container.current;

    scrolling.current = true;
    animateScrollTo(childNodes[index], {
      speed: 1000,
      offset: -48,
      onComplete: () => {
        scrolling.current = false;
      },
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
  }, [blocks, focusedIndex, activedIndex]);

  const renderBlock = (block, index) => {
    const Component = components[`${capitalize(block.type)}Block`];

    return (
      <Block
        title={block.title}
        displayMenu={block.type === 'announcements'}
        onFillFromLastWeekClicked={() => onFillFromLastWeek(index)}
      >
        <Component
          block={block}
          onChange={data => {
            const newBlocks = blocks;
            newBlocks[index] = { ...newBlocks[index], data };
            onChange(newBlocks);
          }}
          onFocus={path => {
            handleFocus(block, path, index);
          }}
          onBlur={handleBlur}
        />
      </Block>
    );
  };

  const renderDivider = index => {
    if (index >= blocks.length - 1) {
      return null;
    }

    return <div className={classes.divider} />;
  };

  return (
    <div className={classes.root}>
      <div ref={activeMarker} className={classes.activeMarker} />
      <div ref={container}>
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className={classnames(classes.block, {
              [classes.active]: currentIndex === index,
            })}
          >
            {renderBlock(block, index)}
            {renderDivider(index)}
          </div>
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
  onFillFromLastWeek: PropTypes.func,
};

export default Form;
