'use client'
import SectionItem from './SectionItem'
import { useAppSelector } from '@/@core/hooks/redux'
import { useParams } from 'next/navigation'

export default function SectionsContainer() {
  const sections = useAppSelector(state => state.sections.sections)
  const params = useParams()
  const projectId = Number(params.projectId)

  return (
    <>
      {sections.map(section => (
        <SectionItem key={section.id} section={section} projectId={projectId} />
      ))}
    </>
  )
}
