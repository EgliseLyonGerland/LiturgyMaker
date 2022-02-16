import React, { memo } from 'react';

import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { blockTypes, slideshowEnabled } from '../../config/global';
import type { BlockType, LiturgyBlock } from '../../types';
import { createDefaultBlock } from '../../utils/defaults';
import Divider from '../Divider';
import Block from '../FormBlock';
import Preview from '../Preview';
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
  const theme = useTheme();
  const isMediumAndUp = useMediaQuery(theme.breakpoints.up('md'));
  const { register } = useFormContext();
  const { fields, insert, remove } = useFieldArray({ name });

  const showPreview = isMediumAndUp && slideshowEnabled;

  const renderBlock = (block: LiturgyBlock, index: number) => {
    const Component = components[block.type];

    if (!Component) {
      return null;
    }

    return (
      <Grid container spacing={4}>
        <Grid item xs={12} md={showPreview ? 8 : 12} xl={showPreview ? 7 : 12}>
          <Block
            title={blockTypes[block.type]}
            subtitle={block.title}
            disabled={disabled}
            onRemoveBlockClicked={() => remove(index)}
            onFillFromLastWeekClicked={() => onFillFromLastWeekClicked(index)}
          >
            <input type="hidden" {...register(`${name}.${index}.type`)} />
            <input type="hidden" {...register(`${name}.${index}.title`)} />

            <Component name={`${name}.${index}.data`} disabled={disabled} />
          </Block>
        </Grid>
        {showPreview && (
          <Grid item xs={0} md={4} xl={5}>
            <Preview block={block} />
          </Grid>
        )}
      </Grid>
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
      {fields.map(({ id, ...block }, index) => (
        <div key={id}>
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
