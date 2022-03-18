import { standardInputOptions } from './standardInputOptions'

export const resourceQuestion = {
  type: 'input',
  name: 'resource',
  message: 'Resource name',
  initial: 'users',
  ...standardInputOptions,
}

export const promptQuestions = [
  resourceQuestion,
  {
    type: 'input',
    name: 'resourceEntity',
    message: 'Resource name (singular)',
    initial: 'user',
    ...standardInputOptions,
  },
  {
    type: 'select',
    name: 'scope',
    message: 'Scope',
    choices: ['resource', 'controller', 'service', 'module'],
  },
]
