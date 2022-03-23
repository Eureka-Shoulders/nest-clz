import { PromptOptions } from 'gluegun/build/types/toolbox/prompt-enquirer-types'
import { DtoTo } from '../../types/prisma'
import { resourceQuestion } from './resourceQuestions'
import { standardInputOptions } from './standardInputOptions'

export const DTO_OPTIONS: DtoTo[] = ['Create', 'Update', 'Get', 'List']

export const toDtoQuestions: PromptOptions[] = [
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
    required: false,
    message:
      'Model name, if not provided, will be the same as resource(singular capitalized)',
  },
  {
    type: 'select',
    name: 'dtoTo',
    message: 'DTO to generate',
    choices: ['All', ...DTO_OPTIONS],
  },
]
