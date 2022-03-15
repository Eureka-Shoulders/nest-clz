import { removeWhitespace } from './removeWhitespace'

export function validatePromptInput(input: string) {
  const inputWithoutWhitespace = removeWhitespace(input)

  if (inputWithoutWhitespace.length) {
    return true
  }
  return 'This option is required'
}
