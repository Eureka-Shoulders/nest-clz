import { GluegunToolbox } from 'gluegun'
import { GenerationPrompt } from '../types'
import { getGenerationOptions } from '../utils'
import { promptQuestions } from '../utils/prompt/promptQuestions'

module.exports = {
  name: 'generate',
  description:
    'Generate services, controllers, models or all of them to create your resource',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      template: { generate },
      print: { info, error, success, warning },
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
    warning(`You need to update your code to complete the generation:
    - Add the subject on Auth type, maybe on "src/common/types/subject.ts"
    ${
      ['controller', 'resource'].includes(promptResult.scope)
        ? '- Add the new controller to your app.module'
        : ''
    }
    `)
  },
}
