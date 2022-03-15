import { GenerationPrompt } from '../types'
import { capitalizeString } from '.'

export function getGenerationOptions({
  scope,
  resource,
  resourceEntity,
  ...rest
}: GenerationPrompt) {
  const resourceNameCapitalized = capitalizeString(resource)
  const resourceEntityNameCapitalized = capitalizeString(resourceEntity)

  const props = {
    resourceName: resource,
    resourceEntityName: resourceEntity,
    resourceNameCapitalized,
    resourceEntityNameCapitalized,
    ...rest,
  }

  switch (scope) {
    case 'resource':
      return [
        {
          template: `module.ts.ejs`,
          target: `src/${resource}/${resource}.module.ts`,
          props,
        },
        {
          template: `controller.ts.ejs`,
          target: `src/${resource}/controllers/${resource}.controller.ts`,
          props,
        },
        {
          template: `service.ts.ejs`,
          target: `src/${resource}/services/${resource}.service.ts`,
          props,
        },
      ]
    case 'controller':
      return [
        {
          template: `controller.ts.ejs`,
          target: `src/${resource}/controllers/${resource}.controller.ts`,
          props,
        },
      ]
    case 'service':
      return [
        {
          template: `service.ts.ejs`,
          target: `src/${resource}/services/${resource}.service.ts`,
          props,
        },
      ]
    case 'module':
      return [
        {
          template: `module.ts.ejs`,
          target: `src/${resource}/${resource}.module.ts`,
          props,
        },
      ]
    default:
      return null
  }
}
