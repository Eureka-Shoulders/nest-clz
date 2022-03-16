import { removeWhitespace, validatePromptInput } from '.'

export const standardInputOptions = {
  validate: validatePromptInput,
  format: removeWhitespace,
  result: removeWhitespace,
}

export const promptQuestions = [
  {
    type: 'input',
    name: 'resource',
    message: 'Resource name (plural)',
    initial: 'users',
    ...standardInputOptions,
  },
  {
    type: 'input',
    name: 'resourceEntity',
    message: 'Resource name (singular)',
    initial: 'user',
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
    name: 'scope',
    message: 'Scope',
    choices: ['resource', 'controller', 'service', 'module'],
  },
]
