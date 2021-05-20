
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

export type ImpactTallyT = {
  critical: number
  serious: number
  moderate: number
  minor: number
}

export type TallyReportT = {
  reportId: string
  tally: {
    byImpact: ImpactTallyT
    byInstance: ImpactTallyT
  }
}

export type FeatureSummaryT = {
  details: Array<{
    route: {
      path: string
    }
    violations: Array<{
      impact: 'critical' | 'serious' | 'moderate' | 'minor'
    }>
  }>
  name: string
  id: string
  tally: {
    byImpact: ImpactTallyT
  }
}

export type SummaryReportT = {
  reportId: string
  features: FeatureSummaryT[]
  routes: {
    numberChecked: number
    with: string[]
    without: string[]
  }
}

export type TallyChartDataT = {
  date: string,
  critical: number
  serious: number
  moderate: number
  minor: number
  none?: number
}
