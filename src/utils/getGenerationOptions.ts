import { capitalizeString } from '@euk-labs/beltz'
import { singular } from 'pluralize'
import { ResourceGenPrompt } from '../types/prompt'
export function getGenerationOptions({
  scope,
  resource,
  ...rest
}: ResourceGenPrompt) {
  const resourceEntityName = singular(resource)

  const props = {
    resourceName: resource,
    resourceEntityName,
    resourceNameCapitalized: capitalizeString(resource),
    resourceEntityNameCapitalized: capitalizeString(resourceEntityName),
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
