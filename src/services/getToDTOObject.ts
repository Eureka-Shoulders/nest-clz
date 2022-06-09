import { capitalizeString } from '@euk-labs/beltz'
import { DtoTo, PrismaField } from '../types/prisma'
import { sensitiveData } from '../utils/presets'

export function getToDTOObject(fields: PrismaField[], dtoTo: DtoTo) {
  let dtoFieldsObject = ''

  fields.forEach((field) => {
    if (sensitiveData.includes(field.name)) return

    if (field.kind === 'object') {
      // Don't return relations on list request (API)
      if (dtoTo === 'List') return
      return (dtoFieldsObject += `"${field.name}": Get${capitalizeString(
        field.name
      )}DTO.toDTO(entity.${field.name}), `)
    }

    dtoFieldsObject += `"${field.name}": entity.${field.name}, `
  })

  return dtoFieldsObject
}
