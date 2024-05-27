import { Box } from '@mui/material'

import type { FormFieldProps, OpenDoorsBlockData } from '../../types'
import ArraySortableControl from '../controls/ArraySortableControl'
import TextFieldControl from '../controls/TextFieldControl'

function OpenDoorsField({ name, disabled = false }: FormFieldProps) {
  return (
    <div>
      <TextFieldControl
        disabled={disabled}
        label="Titre"
        name={`${name}.title`}
      />
      <TextFieldControl
        disabled={disabled}
        label="Informations"
        multiline
        name={`${name}.detail`}
      />

      <Box fontSize={16} fontWeight={900} mb={2} mt={4}>
        Sujets de prière
      </Box>

      <ArraySortableControl<OpenDoorsBlockData['prayerTopics'][number]>
        defaultItem={{ text: '' }}
        disabled={disabled}
        maxItems={3}
        name={`${name}.prayerTopics`}
        renderItem={(item, index) => (
          <TextFieldControl
            label={`Sujet #${index + 1}`}
            name={`${name}.prayerTopics.${index}.text`}
          />
        )}
      />
    </div>
  )
}

export default OpenDoorsField
