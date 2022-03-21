import { DtoTo } from './prisma'
import { Scope } from './resource'

export type DtoGenPrompt = {
  schemaPath: string
  resource: string
  resourceModel?: string
  dtoTo: DtoTo | 'All'
}

export type ResourceGenPrompt = {
  scope: Scope
  resource: string
}
