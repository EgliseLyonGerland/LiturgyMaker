import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';

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
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  onAddBlock = () => {},
  onRemoveBlock = () => {},
  onFillFromLastWeek = () => {},
}) => {
  const handleFocus = (block, path, index) => {
    onFocus(index, path);
  };

  const handleBlur = () => {
    onBlur();
  };

  const renderBlock = (block, index) => {
    const Component = components[`${upperFirst(block.type)}Block`];

    return (
      <Block
        block={block}
        onRemoveBlockClicked={() => onRemoveBlock(index)}
        onFillFromLastWeekClicked={() => onFillFromLastWeek(block)}
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

  const renderDivider = (index) => (
    <Divider
      onBlockSelected={(type) => {
        onAddBlock(index, createDefaultBlock(type));
      }}
    />
  );

  return (
    <div>
      {renderDivider(0)}

      {blocks.map((block, index) => (
        <Fragment key={block.id}>
          {renderBlock(block, index)}
          {renderDivider(index + 1)}
        </Fragment>
      ))}
    </div>
  );
};

Form.propTypes = {
  blocks: PropTypes.array,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onAddBlock: PropTypes.func,
  onRemoveBlock: PropTypes.func,
  onFillFromLastWeek: PropTypes.func,
};

export default Form;
