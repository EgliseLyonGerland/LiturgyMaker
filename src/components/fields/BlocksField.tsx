import React, { memo } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';

import { blockTypes } from '../../config/global';
import type { BlockType, LiturgyBlock } from '../../types';
import { createDefaultBlock } from '../../utils/defaults';
import Divider from '../Divider';
import Block from '../FormBlock';
import AnnouncementsField from './AnnouncementsField';
import OpenDoorsField from './OpenDoorsField';
import ReadingField from './ReadingField';
import RecitationField from './RecitationField';
import SectionField from './SectionField';
import SermonField from './SermonField';
import SongsField from './SongsField';

interface Props {
  name: string;
  disabled: boolean;
  onFillFromLastWeekClicked: (index: number) => void;
}

const components: Record<BlockType, any> = {
  announcements: memo(AnnouncementsField),
  songs: memo(SongsField),
  reading: memo(ReadingField),
  sermon: memo(SermonField),
  section: memo(SectionField),
  recitation: memo(RecitationField),
  openDoors: memo(OpenDoorsField),
};

function BlocksField({
  name,
  disabled = false,
  onFillFromLastWeekClicked,
}: Props) {
  const { control, register } = useFormContext();
  const { fields, insert, remove } = useFieldArray({
    name,
    control,
    keyName: 'key',
  });

  const renderBlock = (block: LiturgyBlock, index: number) => {
    const Component = components[block.type];

    if (!Component) {
      return null;
    }

    return (
      <Block
        title={blockTypes[block.type]}
        subtitle={block.title}
        disabled={disabled}
        onRemoveBlockClicked={() => remove(index)}
        onFillFromLastWeekClicked={() => onFillFromLastWeekClicked(index)}
      >
        <input type="hidden" {...register(`${name}.${index}.type`)} />
        <input type="hidden" {...register(`${name}.${index}.title`)} />

        <Component
          name={`${name}.${index}.data`}
          // @todo: remove this any
          defaultValue={block.data as any}
          disabled={disabled}
        />
      </Block>
    );
  };

  return (
    <div>
      <Divider
        disabled={disabled}
        onBlockSelected={(type) => {
          insert(0, createDefaultBlock(type));
        }}
      />
      {fields.map(({ key, ...block }, index) => (
        <div key={key}>
          {/* @todo: remove the `as` flag */}
          {renderBlock(block as LiturgyBlock, index)}

          <Divider
            disabled={disabled}
            onBlockSelected={(type) => {
              insert(index + 1, createDefaultBlock(type));
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default BlocksField;
