import { removeWhitespace } from '@euk-labs/beltz'
import { validatePromptInput } from '../validatePromptInput'

export const standardInputOptions = {
  validate: validatePromptInput,
  format: removeWhitespace,
  result: removeWhitespace,
}
