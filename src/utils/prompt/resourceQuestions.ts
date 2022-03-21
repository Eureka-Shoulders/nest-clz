import { PromptOptions } from 'gluegun/build/types/toolbox/prompt-enquirer-types'
import { standardInputOptions } from './standardInputOptions'

export const resourceQuestion: PromptOptions = {
  type: 'input',
  name: 'resource',
  message: 'Resource name',
  initial: 'users',
  ...standardInputOptions,
}

export const resourceQuestions: PromptOptions[] = [
  resourceQuestion,
  {
    type: 'select',
    name: 'scope',
    message: 'Scope',
    choices: ['resource', 'controller', 'service', 'module'],
  },
]
