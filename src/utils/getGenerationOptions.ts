import { ResourceGenPrompt } from '../types/prompt'
import { getNamesByResource } from './getNamesByResource'
export function getGenerationOptions({
  scope,
  resource,
  ...rest
}: ResourceGenPrompt) {
  const { resourceName, ...resourceNames } = getNamesByResource(resource)

  const props = {
    resourceName,
    ...resourceNames,
    ...rest,
  }

  switch (scope) {
    case 'resource':
      return [
        {
          template: `module.ts.ejs`,
          target: `src/${resourceName}/${resourceName}.module.ts`,
          props,
        },
        {
          template: `controller.ts.ejs`,
          target: `src/${resourceName}/controllers/${resourceName}.controller.ts`,
          props,
        },
        {
          template: `service.ts.ejs`,
          target: `src/${resourceName}/services/${resourceName}.service.ts`,
          props,
        },
      ]
    case 'controller':
      return [
        {
          template: `controller.ts.ejs`,
          target: `src/${resourceName}/controllers/${resourceName}.controller.ts`,
          props,
        },
      ]
    case 'service':
      return [
        {
          template: `service.ts.ejs`,
          target: `src/${resourceName}/services/${resourceName}.service.ts`,
          props,
        },
      ]
    case 'module':
      return [
        {
          template: `module.ts.ejs`,
          target: `src/${resourceName}/${resourceName}.module.ts`,
          props,
        },
      ]
    default:
      return null
  }
}
