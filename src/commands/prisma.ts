import { getDMMF } from '@prisma/sdk'
import { GluegunToolbox } from 'gluegun'
import { standardInputOptions } from '../utils'

module.exports = {
  name: 'prisma',
  alias: ['p'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      // template: { generate },
      print: { info, error, divider },
      prompt: { ask },
      filesystem,
    } = toolbox

    const { schemaPath } = await ask({
      type: 'input',
      name: 'schemaPath',
      message: 'prisma.schema file path',
      required: false,
      initial: 'prisma/schema.prisma',
      ...standardInputOptions,
    })

    const prismaSchemaStringified = filesystem.read(schemaPath)

    if (!prismaSchemaStringified) {
      error('Prisma Schema not found, try again from root of project')
      return
    }

    const {
      datamodel: { models },
    } = await getDMMF({
      datamodel: prismaSchemaStringified,
    })

    models.forEach((model) => {
      const { name, fields } = model
      info(`Generating ${name}`)
      fields.forEach((field) => {
        const { name, type } = field
        info(`${name}: ${type}`)
      })

      divider()
    })
  },
}
