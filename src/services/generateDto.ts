import { GluegunTemplateGenerateOptions } from 'gluegun/build/types/toolbox/template-types'
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
  const targetPath = `src/${resource}/dtos/${dtoTo.toLocaleLowerCase()}-${model.name.toLowerCase()}.dto.ts`
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
      resourceEntityName: model.name.toLocaleLowerCase(),
      resourceEntityNameCapitalized: model.name,
      resourceName: resource,
      omittedFields: `[${omittedFields}]`,
    },
  })

  return { targetPath }
}
