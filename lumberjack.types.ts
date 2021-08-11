import { ImpactValue, Result, NodeResult } from 'axe-core'
import { Page } from 'puppeteer'

// Client Types

export type RoutesInfo = {
  total: number
  list: string
}

export type ImpactReportPayload = {
  impact: ImpactValue
  data: any
  reportId: string
  summary: {
    rules: RuleSummary[],
    totalInstancesForLevel: number
  }
}

export type TallyReport = {
  reportId: string
  tally: {
    byImpact: ImpactTally
    byInstance: ImpactTally
  }
}

export type SummaryReport = {
  reportId: string
  features: FeatureSummary[]
  routes: RouteViolationSummaryReport
}


// CLI Utility Types

export type AppConfig = {
  accounts?: {
    default: AccountConfig
    [key: string]: AccountConfig 
  }
  errors: {
    content: string[]
    featureId: string
  }
  login?: {
    fields?: {
      // Identifiers for each login form field
      username?: string
      password?: string
      submitButton?: string
    }
    path: string
  }
  name: string
  root: string
  viewports?: Array<{
    height: number
    width: number
  }>
  mainContentElement?: string
}

export type FeatureInfo = {
  id: string
  name: string
}

export type AccountConfig = {
  username: string
  password: string
  params?: {
    [key: string]: string | number
  }
}

export type FeatureConfig = {
  account?: AccountConfig
  paths: string[]
} & FeatureInfo

export type RoutesConfig = {
  features: FeatureConfig[]
  params: {
    [key: string]: string | number
  }
}

export type ImpactTally = {
  critical: number
  serious: number
  moderate: number
  minor: number
}

export type RuleSummary = {
  // TODO: Map to keys of AxeRules directly
  [key: string]: {
    elements: string[]
    totalInstances: number
  }
}

export type FeatureAuditSummary = {
  completedAudits: number
  totalAudits: number
  totalViolations: number
  routesValidated: string[]
  routesNotValidated: string[]
}

export type AuditResultsSummary = {
  featureId: string
  reportId: string
  results: FeatureAuditSummary[]
}

export type RouteAuditSummary = {
  completedAudit: boolean
  numberOfViolations: number
  route: string
}

export type ReportEntry = {
  reportId: string
  featureInfo: FeatureInfo
  route: {
    id: string
    path: string
  }
  needsManualCheck: boolean
  violations: Result[]
}

export type Route = {
  feature: string
  id: string
  paths: string[]
}

export type ViolationSummary = {
  id: string
  data?: []
  relatedNodes: ViolationSummary[]
  impact: ImpactValue
  message: string
}

type ViolationRoute = {
  id: string
  path: string
}

export type UniqueViolationNode = {
  routes?: ViolationRoute[]
} & NodeResult

export type UniqueViolation = {
  nodes: UniqueViolationNode[]
  routes: ViolationRoute[]
} & Omit<Result, 'nodes'>

export type RouteReport = {
  reportId: string
  featureInfo: {
    name: string
    id: string
  }
  route: ViolationRoute
  needsManualCheck: boolean
  violations: UniqueViolation[]
}

export type ViolationOverview = {
  ids: {
    all: string[]
    byImpact: {
      minor: string[]
      moderate: string[]
      serious: string[]
      critical: string[]
    }
  }
  violations: {
    all: UniqueViolation[]
    byImpact: {
      minor: UniqueViolation[]
      moderate: UniqueViolation[]
      serious: UniqueViolation[]
      critical: UniqueViolation[]
    }
  }
}

export type ViolationTally = {
  byImpact: {
    minor: number
    moderate: number
    serious: number
    critical: number
  }
  byInstance: {
    minor: number
    moderate: number
    serious: number
    critical: number
  }
}

export type ViolationReport = {
  overview: ViolationOverview
  reportId: string
}

export type ViolationTallyReport = {
  reportId: string
  tally: ViolationTally
}

export type RouteViolationSummaryReport = {
  numberChecked: number,
  with: string[],
  without: string[]
}

export type FeatureSummary = {
  details: Array<Omit<ReportEntry, 'featureInfo'|'reportId'>>
  id: string
  name: string
  tally: {
    byImpact: {
      minor: number
      moderate: number
      serious: number
      critical: number
    }
  }
}

export type FeatureViolationSummaryReport = {
  reportId: string
  features: FeatureSummary[]
}

// List of maintained Axe rule IDs: https://github.com/dequelabs/axe-core/blob/0dda7338c4e9d50c2dd513dcec4f028c919e2a3a/doc/rule-descriptions.md
export type AxeRules = {
  'area-alt'?: Result
  'aria-allowed-attr'?: Result
  'aria-hidden-body'?: Result
  'aria-hidden-focus'?: Result
  'aria-input-field-name'?: Result
  'aria-required-attr'?: Result
  'aria-required-children'?: Result
  'aria-required-parent'?: Result
  'aria-roledescription'?: Result
  'aria-roles'?: Result
  'aria-toggle-field-name'?: Result
  'aria-valid-attr-value'?: Result
  'aria-valid-attr'?: Result
  'audio-caption'?: Result
  'blink'?: Result
  'button-name'?: Result
  'bypass'?: Result
  'color-contrast'?: Result
  'definition-list'?: Result
  'dlitem'?: Result
  'document-title'?: Result
  'duplicate-id-active'?: Result
  'duplicate-id-aria'?: Result
  'duplicate-id'?: Result
  'form-field-multiple-labels'?: Result
  'frame-title'?: Result
  'html-has-lang'?: Result
  'html-lang-valid'?: Result
  'html-xml-lang-mismatch'?: Result
  'image-alt'?: Result
  'input-button-name'?: Result
  'input-image-alt'?: Result
  'label'?: Result
  'link-name'?: Result
  'list'?: Result
  'listitem'?: Result
  'marquee'?: Result
  'meta-refresh'?: Result
  'object-alt'?: Result
  'role-img-alt'?: Result
  'scrollable-region-focusable'?: Result
  'server-side-image-map'?: Result
  'svg-img-alt'?: Result
  'td-headers-attr'?: Result
  'th-has-data-cells'?: Result
  'valid-lang'?: Result
  'video-caption'?: Result

  'autocomplete-valid'?: Result
  'avoid-inline-spacing'?: Result

  'accesskeys'?: Result
  'aria-allowed-role'?: Result
  'empty-heading'?: Result
  'frame-tested'?: Result
  'frame-title-unique'?: Result
  'heading-order'?: Result
  'identical-links-same-purpose'?: Result
  'image-redundant-alt'?: Result
  'label-title-only'?: Result
  'landmark-banner-is-top-level'?: Result
  'landmark-complementary-is-top-level'?: Result
  'landmark-contentinfo-is-top-level'?: Result
  'landmark-main-is-top-level'?: Result
  'landmark-no-duplicate-banner'?: Result
  'landmark-no-duplicate-contentinfo'?: Result
  'landmark-no-duplicate-main'?: Result
  'landmark-one-main'?: Result
  'landmark-unique'?: Result
  'meta-viewport-large'?: Result
  'meta-viewport'?: Result
  'page-has-heading-one'?: Result
  'region'?: Result
  'scope-attr-valid'?: Result
  'skip-link'?: Result
  'tabindex'?: Result
  'table-duplicate-name'?: Result

  'css-orientation-lock'?: Result
  'focus-order-semantics'?: Result
  'hidden-content'?: Result
  'label-content-name-mismatch'?: Result
  'link-in-text-block'?: Result
  'no-autoplay-audio'?: Result
  'p-as-heading'?: Result
  'table-fake-caption'?: Result
  'td-has-header'?: Result
}
