export type AppConfig = {
  id: string
  login: {
    path: string
  }
  root: string
  errors: {
    content: string[]
    featureId: string
  }
}

export type Feature = {
  name: string
  id: string
  paths: string[]
}

export type RoutesConfig = {
  params: any // this will vary by project
  features: Feature[]
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
  featureInfo: any
  route: {
    id: string
    path: string
  }
  needsManualCheck: boolean
  violations: Violation[]
}

export type Route = {
  feature: string
  id: string
  paths: string[]
}

export type User = {
  email: string
  password: string
}

export type Impact = 'critical' | 'serious' | 'moderate' | 'minor'

export type ViolationSummary = {
  id: string
  data?: []
  relatedNodes: ViolationSummary[]
  impact: Impact
  message: string
}

type ViolationRoute = {
  id: string
  path: string
}

export type ViolationNode = {
  any: ViolationSummary[]
  all: ViolationSummary[]
  failureSummary: string
  impact: Impact
  html: string
  none: ViolationSummary[]
  routes?: ViolationRoute[]
  target: string[]
}

export type Violation = {
  id: string
  impact: string
  tags: string[]
  description: string
  help: string
  helpUrl: string
  nodes: ViolationNode[]
}

export type UniqueViolation = {
  description: string
  helpUrl: string
  impact: string
  instances: ViolationNode[]
  ruleId: string
  summary: string
}

export type RouteReport = {
  reportId: string
  featureInfo: {
    name: string
    id: string
  }
  route: ViolationRoute
  needsManualCheck: boolean
  violations: Violation[]
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
  reportId: string
  overview: ViolationOverview
}

export type ViolationTallyReport = {
  reportId: string
  tally: ViolationTally
}

// List of maintained Axe rule IDs: https://github.com/dequelabs/axe-core/blob/0dda7338c4e9d50c2dd513dcec4f028c919e2a3a/doc/rule-descriptions.md
export type AxeRules = {
  'area-alt'?: Violation
  'aria-allowed-attr'?: Violation
  'aria-hidden-body'?: Violation
  'aria-hidden-focus'?: Violation
  'aria-input-field-name'?: Violation
  'aria-required-attr'?: Violation
  'aria-required-children'?: Violation
  'aria-required-parent'?: Violation
  'aria-roledescription'?: Violation
  'aria-roles'?: Violation
  'aria-toggle-field-name'?: Violation
  'aria-valid-attr-value'?: Violation
  'aria-valid-attr'?: Violation
  'audio-caption'?: Violation
  'blink'?: Violation
  'button-name'?: Violation
  'bypass'?: Violation
  'color-contrast'?: Violation
  'definition-list'?: Violation
  'dlitem'?: Violation
  'document-title'?: Violation
  'duplicate-id-active'?: Violation
  'duplicate-id-aria'?: Violation
  'duplicate-id'?: Violation
  'form-field-multiple-labels'?: Violation
  'frame-title'?: Violation
  'html-has-lang'?: Violation
  'html-lang-valid'?: Violation
  'html-xml-lang-mismatch'?: Violation
  'image-alt'?: Violation
  'input-button-name'?: Violation
  'input-image-alt'?: Violation
  'label'?: Violation
  'link-name'?: Violation
  'list'?: Violation
  'listitem'?: Violation
  'marquee'?: Violation
  'meta-refresh'?: Violation
  'object-alt'?: Violation
  'role-img-alt'?: Violation
  'scrollable-region-focusable'?: Violation
  'server-side-image-map'?: Violation
  'svg-img-alt'?: Violation
  'td-headers-attr'?: Violation
  'th-has-data-cells'?: Violation
  'valid-lang'?: Violation
  'video-caption'?: Violation

  'autocomplete-valid'?: Violation
  'avoid-inline-spacing'?: Violation

  'accesskeys'?: Violation
  'aria-allowed-role'?: Violation
  'empty-heading'?: Violation
  'frame-tested'?: Violation
  'frame-title-unique'?: Violation
  'heading-order'?: Violation
  'identical-links-same-purpose'?: Violation
  'image-redundant-alt'?: Violation
  'label-title-only'?: Violation
  'landmark-banner-is-top-level'?: Violation
  'landmark-complementary-is-top-level'?: Violation
  'landmark-contentinfo-is-top-level'?: Violation
  'landmark-main-is-top-level'?: Violation
  'landmark-no-duplicate-banner'?: Violation
  'landmark-no-duplicate-contentinfo'?: Violation
  'landmark-no-duplicate-main'?: Violation
  'landmark-one-main'?: Violation
  'landmark-unique'?: Violation
  'meta-viewport-large'?: Violation
  'meta-viewport'?: Violation
  'page-has-heading-one'?: Violation
  'region'?: Violation
  'scope-attr-valid'?: Violation
  'skip-link'?: Violation
  'tabindex'?: Violation
  'table-duplicate-name'?: Violation

  'css-orientation-lock'?: Violation
  'focus-order-semantics'?: Violation
  'hidden-content'?: Violation
  'label-content-name-mismatch'?: Violation
  'link-in-text-block'?: Violation
  'no-autoplay-audio'?: Violation
  'p-as-heading'?: Violation
  'table-fake-caption'?: Violation
  'td-has-header'?: Violation
}
