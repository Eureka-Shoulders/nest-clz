import { DtoTo, PrismaModel } from '../types/prisma'
import { getDtoFieldStringified } from './getDtoFieldStringified'

export function getDtoClassStringified(model: PrismaModel, dtoTo: DtoTo) {
  const { name: modelName, fields } = model

  let dtoFieldsObject = ''
  let omittedFields = ''

  fields.forEach((field) => {
    const fieldTemplate = getDtoFieldStringified(field, dtoTo, modelName)

    if (field.kind === 'object') omittedFields += `"${field.name}", `

    if (fieldTemplate) dtoFieldsObject += fieldTemplate
  })

  return { dtoFieldsObject, omittedFields }
}
