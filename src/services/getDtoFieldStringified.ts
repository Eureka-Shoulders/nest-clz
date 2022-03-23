import { DtoTo, PrismaField } from '../types/prisma'
import { dateAttributes, sensitiveData } from '../utils/presets'

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
  fieldType: string,
  relationWith: string,
  dtoTo: DtoTo
) {
  if (relationWith) {
    return `@Type(() => ${dtoTo}${relationWith}Dto)
    @ValidateNested()`
  }

  let extraValidators = ''

  switch (fieldName) {
    case 'email':
      extraValidators += `@IsEmail()`
      break
    case 'password':
      extraValidators += `@IsStrongPassword()`
      break
    default:
      if (fieldName.endsWith('Id')) {
        extraValidators += `@IsUUID()`
      }
      break
  }

  switch (fieldType) {
    case 'boolean':
      extraValidators += `@IsBoolean()`
      break
    case 'number':
      extraValidators += `@IsNumber()`
      break
    case 'Date':
      extraValidators += `@IsDateString()`
      break
    default:
      break
  }

  return extraValidators
}

export function getDtoFieldStringified(
  { name, relationName, ...field }: PrismaField,
  dtoTo: DtoTo,
  modelName: string
) {
  if (field.kind === 'unsupported') return ''

  const relationWith =
    field.kind === 'object' && relationName !== undefined
      ? relationName.replace(`${modelName}`, '').replace('To', '')
      : null

  const fieldType = relationWith
    ? `${dtoTo}${relationWith}Dto`
    : handleType(field.type)

  const nameLine = `${name}${field.isRequired ? '?' : ''}: ${fieldType}${
    field.isList ? '[]' : ''
  }`

  const propertyTipe =
    field.kind === 'enum'
      ? `enum: ${fieldType}`
      : relationWith
      ? `type: ${fieldType}`
      : `type: '${fieldType}'`

  switch (dtoTo) {
    case 'Create':
      if (field.isId || dateAttributes.includes(name)) return ''

      return `
    ${
      field.isRequired
        ? fieldType === 'string'
          ? '@IsNotEmpty()'
          : '@IsDefined()'
        : '@IsOptional()'
    }
    ${getExtraValidators(name, fieldType, relationWith, dtoTo)}
    ${nameLine}
    `

    case 'Update':
      if (field.isId || dateAttributes.includes(name)) return ''

      if (relationWith) {
        return `
        @IsOptional()
        ${name}?: ${fieldType}${field.isList ? '[]' : ''}`
      }
      return ''

    case 'Get':
      if (sensitiveData.includes(name)) return ''

      return `
      @ApiProperty({ ${propertyTipe}${
        field.isList && field.kind !== 'enum' ? '[]' : ''
      } })
      ${nameLine}
      `
    case 'List':
      if (sensitiveData.includes(name) || field.kind === 'object') return ''

      return `
      @ApiProperty({ ${propertyTipe}${
        field.isList && field.kind !== 'enum' ? '[]' : ''
      } })
      ${nameLine}
      `
    default:
      return ''
  }
}
