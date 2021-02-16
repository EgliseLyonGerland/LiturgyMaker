import { memo } from 'react';
import { useFieldArray } from 'react-hook-form';
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

const BlocksField = ({
  name,
  register,
  control,
  onFillFromLastWeekClicked,
}) => {
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
        onRemoveBlockClicked={() => remove(index)}
        onFillFromLastWeekClicked={() => onFillFromLastWeekClicked(index)}
      >
        <input
          type="hidden"
          name={`${name}[${index}].type`}
          value={block.type}
          ref={register()}
        />
        <input
          type="hidden"
          name={`${name}[${index}].title`}
          value={block.title}
          ref={register()}
        />

        <Component
          name={`${name}[${index}].data`}
          register={register}
          control={control}
          defaultValue={block.data}
        />
      </Block>
    );
  };

  return (
    <div>
      <Divider
        onBlockSelected={(type) => {
          insert(0, createDefaultBlock(type));
        }}
      />
      {fields.map(({ key, ...block }, index) => (
        <div key={key}>
          {renderBlock(block, index)}

          <Divider
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
