export type PrimaryFieldKind = 'object' | 'scalar' | 'enum' | 'unsupported'

export type PrismaField = {
  kind: PrimaryFieldKind
  name: string
  isRequired: boolean
  isList: boolean
  isUnique: boolean
  isId: boolean
  isReadOnly: boolean
  isGenerated?: boolean
  isUpdatedAt?: boolean
  type: string
  dbNames?: string[] | null
  hasDefaultValue: boolean
  default?: any
  relationName?: string
}

export type PrismaModel = {
  name: string
  dbName: string | null
  fields: PrismaField[]
  fieldMap?: Record<string, PrismaField>
  uniqueFields: string[][]
  documentation?: string
}

export type DtoTo = 'Create' | 'Update' | 'Get' | 'List'
