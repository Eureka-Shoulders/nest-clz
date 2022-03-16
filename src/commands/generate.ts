import { GluegunToolbox } from 'gluegun'
import { GenerationPrompt } from '../types'
import { getGenerationOptions } from '../utils'
import { promptQuestions } from '../utils'

module.exports = {
  name: 'generate',
  description:
    'Generate services, controllers, models or all of them to create your resource',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      template: { generate },
      print: { info, error, success },
      prompt,
    } = toolbox

    const promptResult = await prompt.ask(promptQuestions)

    info(`Generating ${promptResult.scope} ${promptResult.resource}...`)

    const generationOptions = getGenerationOptions(
      promptResult as GenerationPrompt
    )

    if (!generationOptions) {
      error('Error on generating options with your input.')
      return
    }

    for (const options of generationOptions) {
      await generate(options)
    }

    success(
      `Generated ${promptResult.scope} ${promptResult.resource} with success`
    )
  },
}
