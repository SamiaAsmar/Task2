import { Section } from './section'

export type Project = {
  id: number
  name: string
  description: string
  owner: string
  sections: Section[]
  ownerId: number
}
