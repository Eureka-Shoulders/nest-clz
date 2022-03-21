import { capitalizeString } from '@euk-labs/beltz'
import { GluegunTemplateGenerateOptions } from 'gluegun/build/types/toolbox/template-types'
import { singular } from 'pluralize'
import { DtoTo, PrismaModel } from '../types/prisma'
import { getDtoClassStringified } from './getDtoClassStringified'
import { getDtoImportsStringified } from './getDtoImportsStringified'

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
  const resourceName = resource.toLocaleLowerCase()
  const resourceEntityName = singular(resourceName)
  const targetPath = `src/${resourceName}/dtos/${dtoTo.toLocaleLowerCase()}-${resourceEntityName}.dto.ts`
  const { dtoFieldsObject, omittedFields } = getDtoClassStringified(
    model,
    dtoTo
  )
  const dtoImports = getDtoImportsStringified(model, dtoTo)

  await generate({
    template: `${dtoTo.toLocaleLowerCase()}.dto.ejs`,
    target: targetPath,
    props: {
      dtoImports,
      dtoFieldsObject,
      resourceEntityName,
      resourceEntityNameCapitalized: capitalizeString(resourceEntityName),
      resourceName,
      omittedFields: `[${omittedFields}]`,
    },
  })

  return { targetPath }
}
