import { removeWhitespace } from '@euk-labs/beltz'

export function validatePromptInput(input: string) {
  const inputWithoutWhitespace = removeWhitespace(input)

  if (inputWithoutWhitespace.length) {
    return true
  }
  return 'This option is required'
}
