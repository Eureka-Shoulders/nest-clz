import { getDMMF } from '@prisma/sdk'
import { GluegunToolbox } from 'gluegun'
import { generateDto } from '../services/generateDto'
import { DtoTo } from '../types/prisma'
import { standardInputOptions } from '../utils'

const DTO_OPTIONS: DtoTo[] = ['Create', 'Update']

module.exports = {
  name: 'prisma',
  alias: ['p'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      template: { generate },
      print: { info, error, success },
      prompt: { ask },
      filesystem,
      system: { run },
    } = toolbox

    const { schemaPath, resourceModel, resource, dtoTo } = await ask([
      {
        type: 'input',
        name: 'schemaPath',
        message: 'prisma.schema file path',
        required: false,
        initial: 'prisma/schema.prisma',
        ...standardInputOptions,
      },
      {
        type: 'input',
        name: 'resource',
        message: 'Resource name (plural)',
        initial: 'users',
        ...standardInputOptions,
      },
      {
        type: 'input',
        name: 'resourceModel',
        message:
          'Model name (optional, if not provided, will be the same as resource(singular capitalized)) and if throws error, the other files will be generated anyway',
        initial: 'User',
        ...standardInputOptions,
      },
      {
        type: 'select',
        name: 'dtoTo',
        message: 'DTO to generate',
        choices: ['All', ...DTO_OPTIONS],
      },
    ])

    const prismaSchemaFile = filesystem.read(schemaPath)

    if (!prismaSchemaFile) {
      error('Prisma Schema not found, try again from root of project')
      return
    }

    const {
      datamodel: { models },
    } = await getDMMF({
      datamodel: prismaSchemaFile,
    })

    const model = models.find((m) => m.name === resourceModel)

    if (!model) {
      error('Model not found, verify if your model name exists in your schema')
      return
    }

    info(`Generating standard ${model.name} DTO's`)

    switch (dtoTo) {
      case 'All':
        for (const dtoOption of DTO_OPTIONS) {
          const { targetPath } = await generateDto({
            resource,
            dtoTo: dtoOption as DtoTo,
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
          dtoTo: dtoTo as DtoTo,
          model,
          generate,
        })
        run(`npx prettier --write ${targetPath}`)
        success(`${model.name} DTO generated on ${targetPath}`)
        break
    }
  },
}
