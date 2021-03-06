import { capitalizeString } from '@euk-labs/beltz'
import { getDMMF } from '@prisma/sdk'
import { GluegunToolbox } from 'gluegun'
import { singular } from 'pluralize'
import { generateDto } from '../services/generateDto'
import { DtoGenPrompt } from '../types/prompt'
import { DTO_OPTIONS, toDtoQuestions } from '../utils/prompt/toDtoQuestions'

module.exports = {
  name: 'prisma',
  alias: ['p'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      prompt: { ask },
      system: { run },
      filesystem: { read },
      template: { generate },
      print: { info, error, success },
    } = toolbox

    const { schemaPath, resourceModel, resource, dtoTo } =
      await ask<DtoGenPrompt>(toDtoQuestions)

    const prismaSchemaFile = read(schemaPath)

    if (!prismaSchemaFile) {
      error('Prisma Schema not found, try again from root of project')
      return
    }

    const {
      datamodel: { models },
    } = await getDMMF({
      datamodel: prismaSchemaFile,
    })

    const modelName = resourceModel || capitalizeString(singular(resource))

    const model = models.find((m) => m.name === modelName)

    if (!model) {
      error(
        `Model ${modelName}  not found, verify if your model name exists in your schema`
      )
      return
    }

    info(`Generating standard ${model.name} DTO's`)

    switch (dtoTo) {
      case 'All':
        for (const dtoOption of DTO_OPTIONS) {
          const { targetPath } = await generateDto({
            resource,
            dtoTo: dtoOption,
            model,
            generate,
          })

          run(`npx prettier --write ${targetPath}`)
          success(`${model.name} DTO generated on ${targetPath}`)
        }
        break
      default:
        const { targetPath } = await generateDto({
          resource,
          dtoTo: dtoTo,
          model,
          generate,
        })
        run(`npx prettier --write ${targetPath}`)
        success(`${model.name} DTO generated on ${targetPath}`)
        break
    }
  },
}
