import { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import upperFirst from 'lodash/upperFirst';

import { blockTypes } from '../../config/global';
import { createDefaultBlock } from '../../utils/defaults';

import Divider from '../Divider';
import Block from '../FormBlock';

import AnnouncementsField from '../fields/AnnouncementsField';
import SongsField from '../fields/SongsField';
import ReadingField from '../fields/ReadingField';
import SermonField from '../fields/SermonField';
import SectionField from '../fields/SectionField';
import RecitationField from '../fields/RecitationField';
import OpenDoorsField from '../fields/OpenDoorsField';

const components = {
  AnnouncementsField: memo(AnnouncementsField),
  SongsField: memo(SongsField),
  ReadingField: memo(ReadingField),
  SermonField: memo(SermonField),
  SectionField: memo(SectionField),
  RecitationField: memo(RecitationField),
  OpenDoorsField: memo(OpenDoorsField),
};

const BlocksField = ({ name, disabled = false, onFillFromLastWeekClicked }) => {
  const { control, register } = useFormContext();
  const { fields, insert, remove } = useFieldArray({
    name,
    control,
    keyName: 'key',
  });

  const renderBlock = (block, index) => {
    const Component = components[`${upperFirst(block.type)}Field`];

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
          defaultValue={block.data}
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
          {renderBlock(block, index)}

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
};

export default BlocksField;
