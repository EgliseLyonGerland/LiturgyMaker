import { Grid, useMediaQuery, useTheme } from '@mui/material'
import type { FC, MemoExoticComponent } from 'react'
import { memo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { blockTypes, slideshowEnabled } from '../../config/global'
import type { BlockType, FormFieldProps, LiturgyBlock } from '../../types'
import { createDefaultBlock } from '../../utils/defaults'
import Divider from '../Divider'
import Block from '../FormBlock'
import Preview from '../Preview'
import AnnouncementsField from './AnnouncementsField'
import OpenDoorsField from './OpenDoorsField'
import ReadingField from './ReadingField'
import RecitationField from './RecitationField'
import SectionField from './SectionField'
import SermonField from './SermonField'
import SongsField from './SongsField'

interface Props {
  name: string
  disabled: boolean
  getPreviousWeekBlock: (index: number) => Promise<LiturgyBlock | null>
}

const components: Record<BlockType, MemoExoticComponent<FC<FormFieldProps>>> = {
  announcements: memo(AnnouncementsField),
  songs: memo(SongsField),
  reading: memo(ReadingField),
  sermon: memo(SermonField),
  section: memo(SectionField),
  recitation: memo(RecitationField),
  openDoors: memo(OpenDoorsField),
}

function BlocksField({ name, disabled = false, getPreviousWeekBlock }: Props) {
  const theme = useTheme()
  const isMediumAndUp = useMediaQuery(theme.breakpoints.up('md'))
  const { register } = useFormContext()
  const { fields, insert, remove, update } = useFieldArray({
    name,
    keyName: 'key',
  })

  const showPreview = isMediumAndUp && slideshowEnabled

  const renderBlock = (block: LiturgyBlock, index: number) => {
    const Component = components[block.type]

    if (!Component) {
      return null
    }

    return (
      <Grid container spacing={4}>
        <Grid item md={showPreview ? 8 : 12} xl={showPreview ? 7 : 12} xs={12}>
          <Block
            disabled={disabled}
            onFillFromLastWeekClicked={async () => {
              const previousBlock = await getPreviousWeekBlock(index)

              if (previousBlock) {
                update(index, previousBlock)
              }
            }}
            onRemoveBlockClicked={() => remove(index)}
            subtitle={block.title}
            title={blockTypes[block.type]}
          >
            <input type="hidden" {...register(`${name}.${index}.type`)} />
            <input type="hidden" {...register(`${name}.${index}.title`)} />

            <Component disabled={disabled} name={`${name}.${index}.data`} />
          </Block>
        </Grid>
        {showPreview && (
          <Grid item md={4} xl={5} xs={0}>
            <Preview block={block} />
          </Grid>
        )}
      </Grid>
    )
  }

  return (
    <div>
      <Divider
        disabled={disabled}
        onBlockSelected={(type) => {
          insert(0, createDefaultBlock(type))
        }}
      />
      {fields.map(({ key, ...block }, index) => (
        <div key={key}>
          {/* @todo: remove the `as` flag */}
          {renderBlock(block as LiturgyBlock, index)}

          <Divider
            disabled={disabled}
            onBlockSelected={(type) => {
              insert(index + 1, createDefaultBlock(type))
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default BlocksField
