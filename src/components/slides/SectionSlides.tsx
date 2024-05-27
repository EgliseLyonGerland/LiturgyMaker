import type { SectionBlockData } from '../../types'

interface Props {
  data: SectionBlockData
}

function SectionSlides({ data }: Props) {
  return (
    <section>
      <h1>{data.title}</h1>
    </section>
  )
}

export default SectionSlides
