import type { FormFieldProps } from '../../types'
import ArraySortableControl from '../controls/ArraySortableControl'
import TextFieldControl from '../controls/TextFieldControl'

function AnnouncementsField({ name, disabled = false }: FormFieldProps) {
  return (
    <ArraySortableControl
      defaultItem={{ title: '', detail: '' }}
      disabled={disabled}
      gutters={3}
      name={`${name}.items`}
      renderItem={(item, index) => (
        <div>
          <TextFieldControl
            disabled={disabled}
            label="Titre"
            name={`${name}.items.${index}.title`}
          />
          <TextFieldControl
            disabled={disabled}
            label="Détails"
            multiline
            name={`${name}.items.${index}.detail`}
          />
        </div>
      )}
    />
  )
}

export default AnnouncementsField
