export type Scope = 'app' | 'resource' | 'controller' | 'service' | 'module'

export type GenerationPrompt = {
  scope: Scope
  resource: string
  resourceEntity: string
}
