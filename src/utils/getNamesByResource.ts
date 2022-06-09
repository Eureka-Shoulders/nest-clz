import { capitalizeString } from '@euk-labs/beltz'
import { singular } from 'pluralize'

export function getNamesByResource(resource: string) {
  const resourceName = resource.toLocaleLowerCase()
  const resourceEntityName = singular(resourceName)
  return {
    resourceName,
    resourceEntityName,
    resourceNameCapitalized: capitalizeString(resourceName),
    resourceEntityNameCapitalized: capitalizeString(resourceEntityName),
  }
}
