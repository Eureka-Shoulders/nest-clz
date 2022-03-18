import { DtoTo } from '../../types/prisma'
import { resourceQuestion } from './promptQuestions'
import { standardInputOptions } from './standardInputOptions'

export const DTO_OPTIONS: DtoTo[] = ['Create', 'Update']

export const toDtoQuestions = [
  {
    type: 'input',
    name: 'schemaPath',
    message: 'prisma.schema file path',
    required: false,
    initial: 'prisma/schema.prisma',
    ...standardInputOptions,
  },
  resourceQuestion,
  {
    type: 'input',
    name: 'resourceModel',
    message:
      'Model name, if not provided, will be the same as resource(singular capitalized)',
    ...standardInputOptions,
  },
  {
    type: 'select',
    name: 'dtoTo',
    message: 'DTO to generate',
    choices: ['All', ...DTO_OPTIONS],
  },
]
