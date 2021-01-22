
export type ImpactLevelsT = 'critical' | 'serious' | 'moderate' | 'main'

export type NavItemT = {
  id: string
  name: string
}

export type RecommendedFixT = {
  data: any
  id: string
  impact: ImpactLevelsT
  message: string
  relatedNodes: any[]
}

export type RoutesInfoT = {
  total: number
  list: string
}

export type ViolationInstanceT = {
  all: RecommendedFixT[] | []
  any: RecommendedFixT[] | []
  relatedNodes?: any[]
  failureSummary?: string
  html: string
  routes?: Array<{
    path: string
  }>
  target: string[]
}

export type ViolationT = {
  description: string
  help: string
  helpUrl: string
  index: number
  impact: ImpactLevelsT
  instances: ViolationInstanceT[]
  ruleId: string
  summary: string
}