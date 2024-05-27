import type { FormFieldProps } from '../../types'
import TextFieldControl from '../controls/TextFieldControl'

function SectionField({ name, disabled = false }: FormFieldProps) {
  return (
    <TextFieldControl
      disabled={disabled}
      label="Titre"
      name={`${name}.title`}
    />
  )
}

export default SectionField
