import { DtoTo, PrismaModel } from '../types/prisma'

export function getDtoImportsStringified(model: PrismaModel, dtoTo: DtoTo) {
  let imports = ''

  model.fields.forEach((field) => {
    const { kind, type, relationName } = field

    if (kind === 'enum') {
      imports += `import { ${type} } from '@prisma/client'\n`
    }

    if (kind === 'object' && relationName !== undefined) {
      const relationWith = relationName
        .replace(`${model.name}`, '')
        .replace('To', '')
      const relationDto = `${dtoTo}${relationWith}Dto`
      // TODO: pluralize resource name
      imports += `import { ${relationDto} } from '@${relationWith.toLocaleLowerCase()}/dtos/create-${relationWith.toLocaleLowerCase()}.dto'\n`
    }
  })

  return imports
}
