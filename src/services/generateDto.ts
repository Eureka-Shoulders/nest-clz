import { GluegunTemplateGenerateOptions } from 'gluegun/build/types/toolbox/template-types'
import { DtoTo, PrismaModel } from '../types/prisma'
import { getNamesByResource } from '../utils/getNamesByResource'
import { getDtoClassStringified } from './getDtoClassStringified'
import { getDtoImportsStringified } from './getDtoImportsStringified'
import { getToDTOObject } from './getToDTOObject'

export async function generateDto({
  resource,
  dtoTo,
  model,
  generate,
}: {
  resource: string
  dtoTo: DtoTo
  model: PrismaModel
  generate: (options: GluegunTemplateGenerateOptions) => Promise<string>
}) {
  const resourceNames = getNamesByResource(resource)

  const targetPath = `src/${
    resourceNames.resourceName
  }/dtos/${dtoTo.toLocaleLowerCase()}-${
    resourceNames.resourceEntityName
  }.dto.ts`
  const dtoImports = getDtoImportsStringified(model, dtoTo)
  const { dtoFieldsObject, omittedFields } = getDtoClassStringified(
    model,
    dtoTo
  )
  const toDTOObject = getToDTOObject(model.fields, dtoTo)

  await generate({
    template: `${dtoTo.toLocaleLowerCase()}.dto.ejs`,
    target: targetPath,
    props: {
      ...resourceNames,
      dtoImports,
      dtoFieldsObject,
      omittedFields: `[${omittedFields}]`,
      toDTOObject: `{ ${toDTOObject} }`,
    },
  })

  return { targetPath }
}
