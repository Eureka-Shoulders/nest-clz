import { DtoTo, PrismaField } from '../types/prisma'

function handleType(type: string) {
  switch (type) {
    case 'String':
    case 'Boolean':
      return type.toLocaleLowerCase()
    case 'Int':
    case 'Float':
    case 'BigInt':
    case 'Decimal':
      return 'number'
    case 'DateTime':
    case 'Date':
      return 'Date'
    case 'JSON':
    case 'JSONObject':
      return 'object'
    case 'Enum':
      return 'enum'
    default:
      return type
  }
}

function getExtraValidators(
  fieldName: string,
  relationWith: string,
  dtoTo: DtoTo
) {
  if (relationWith) {
    return `@Type(() => ${dtoTo}${relationWith}Dto)
    @ValidateNested()`
  }
  switch (fieldName) {
    case 'email':
      return `@IsEmail()`
    case 'password':
      return `@IsNotEmpty()
    @IsStrongPassword()`
    default:
      return ''
  }
}

export function getDtoFieldStringified(
  { name, relationName, ...field }: PrismaField,
  dtoTo: DtoTo,
  modelName: string
) {
  if (
    field.isId ||
    field.kind === 'unsupported' ||
    name === 'createdAt' ||
    name === 'updatedAt'
  ) {
    return ''
  }

  const relationWith =
    field.kind === 'object' && relationName !== undefined
      ? relationName.replace(`${modelName}`, '').replace('To', '')
      : null

  const fieldType = relationWith
    ? `${dtoTo}${relationWith}Dto`
    : handleType(field.type)

  switch (dtoTo) {
    case 'Create':
      return `
    ${field.isRequired ? '@IsDefined()' : '@IsOptional()'}
    ${getExtraValidators(name, relationWith, dtoTo)}
    ${name}: ${fieldType}${field.isList ? '[]' : ''}
    `
    case 'Update':
      if (relationWith) {
        return `
        @IsOptional()
        ${name}?: ${fieldType}${field.isList ? '[]' : ''}`
      }
      return ''
    default:
      return ''
  }
}
