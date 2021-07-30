// Same content as schema.graphql, just wrapped for Gatsby's sake

module.exports = `
type SitePageContext {
  impact: String
  data: [SitePageContextData]
  reportId: Date
  id: String
  name: String
  details: [SitePageContextDetails]
  tally: SitePageContextTally
}

type SitePageContextData {
  description: String
  helpUrl: String
  impact: String
  instances: [SitePageContextDataInstances]
  routes: [SitePageContextDataRoutes]
  ruleId: String
  summary: String
  tags: [String]
}

type SitePageContextDataInstances {
  html: String
  routes: [SitePageContextDataInstancesRoutes]
  all: [SitePageContextDataInstancesAll]
  any: [SitePageContextDataInstancesAny]
}

type SitePageContextDataInstancesRoutes {
  path: String
}

type SitePageContextDataInstancesAll {
  message: String
}

type SitePageContextDataInstancesAny {
  message: String
}

type SitePageContextDataRoutes {
  path: String
}

type SitePageContextDetails {
  route: SitePageContextDetailsRoute
  violations: [SitePageContextDetailsViolations]
}

type SitePageContextDetailsRoute {
  id: String
  path: String
}

type SitePageContextDetailsViolations {
  help: String
  impact: String
  helpUrl: String
  description: String
  nodes: [SitePageContextDetailsViolationsNodes]
  id: String
}

type SitePageContextDetailsViolationsNodes {
  html: String
}

type SitePageContextTally {
  byImpact: SitePageContextTallyByImpact
}

type SitePageContextTallyByImpact {
  critical: Int
  minor: Int
  moderate: Int
  serious: Int
}

type SummariesJson implements Node {
  reportId: String!
  totalViolationsForAllFeature: Int!
  routes: RoutesInfo
  totalViolationsForAllFeatures: Int
  features: [SummariesJsonFeatures]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type SummariesJsonFeatures {
  id: String
  name: String
  details: [SummariesJsonFeaturesDetails]
  tally: SummariesJsonFeaturesTally
}

type SummariesJsonFeaturesDetails {
  needsManualCheck: Boolean
  route: SummariesJsonFeaturesDetailsRoute
  violations: [SummariesJsonFeaturesDetailsViolations]
}

type SummariesJsonFeaturesDetailsRoute {
  id: String
  path: String
}

type SummariesJsonFeaturesDetailsViolations {
  id: String
  impact: String
  tags: [String]
  description: String
  help: String
  helpUrl: String
  nodes: [SummariesJsonFeaturesDetailsViolationsNodes]
}

type SummariesJsonFeaturesDetailsViolationsNodes {
  any: [SummariesJsonFeaturesDetailsViolationsNodesAny]
  all: [SummariesJsonFeaturesDetailsViolationsNodesAll]
  impact: String
  html: String
  target: [String]
  failureSummary: String
}

type SummariesJsonFeaturesDetailsViolationsNodesAny {
  id: String
  relatedNodes: [SummariesJsonFeaturesDetailsViolationsNodesAnyRelatedNodes]
  impact: String
  message: String
}

type SummariesJsonFeaturesDetailsViolationsNodesAnyRelatedNodes {
  html: String
  target: [String]
}

type SummariesJsonFeaturesDetailsViolationsNodesAll {
  id: String
  impact: String
  message: String
}

type SummariesJsonFeaturesTally {
  byImpact: SummariesJsonFeaturesTallyByImpact
}

type SummariesJsonFeaturesTallyByImpact {
  minor: Int
  moderate: Int
  serious: Int
  critical: Int
}

type RoutesInfo implements Node {
  notValidated: [String]
  validated: [String]
  numberChecked: Int!
  with: [String]
  without: [String]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type UniqueViolationsJsonOverviewViolationsByImpactModerate implements Node {
  instances: [InstancesInfo]
  description: String
  helpUrl: String
  impact: String
  routes: [UniqueViolationsJsonOverviewViolationsByImpactModerateRoutes]
  ruleId: String
  summary: String
  tags: [String]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type UniqueViolationsJsonOverviewViolationsByImpactModerateRoutes {
  id: String
  path: String
}

type UniqueViolationsJsonOverviewViolationsByImpactMinor implements Node {
  instances: [InstancesInfo]
  description: String
  helpUrl: String
  impact: String
  routes: [UniqueViolationsJsonOverviewViolationsByImpactMinorRoutes]
  ruleId: String
  summary: String
  tags: [String]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type UniqueViolationsJsonOverviewViolationsByImpactMinorRoutes {
  id: String
  path: String
}

type UniqueViolationsJsonOverviewViolationsByImpactSerious implements Node {
  instances: [InstancesInfo]
  description: String
  helpUrl: String
  impact: String
  routes: [UniqueViolationsJsonOverviewViolationsByImpactSeriousRoutes]
  ruleId: String
  summary: String
  tags: [String]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type UniqueViolationsJsonOverviewViolationsByImpactSeriousRoutes {
  id: String
  path: String
}

type UniqueViolationsJsonOverviewViolationsByImpactCritical implements Node {
  instances: [InstancesInfo]
  description: String
  helpUrl: String
  impact: String
  routes: [UniqueViolationsJsonOverviewViolationsByImpactCriticalRoutes]
  ruleId: String
  summary: String
  tags: [String]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type UniqueViolationsJsonOverviewViolationsByImpactCriticalRoutes {
  id: String
  path: String
}

type InstancesInfo implements Node {
  any: [FixInfoAny]
  all: [FixInfoAll]
  impact: String
  html: String
  target: [String]
  failureSummary: String
  routes: [RouteData]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type FixInfoAny implements Node {
  id: ID!
  data: FixData
  relatedNodes: [RelatedNodes]
  impact: String
  message: String
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type RelatedNodes implements Node {
  html: String
  target: [String]
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type FixInfoAll implements Node {
  id: ID!
  impact: String
  message: String
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type FixData implements Node {
  role: String
  accessibleText: String
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type RouteData implements Node {
  id: ID!
  path: String
  parent: Node
  children: [Node!]!
  internal: Internal!
}

type UniqueViolationsJson implements Node {
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
  reportId(
    # Format the date using Moment.js' date tokens, e.g. 'date(formatString: "YYYY MMMM DD")'. See https://momentjs.com/docs/#/displaying/format/ for documentation for different tokens.
    formatString: String

    # Returns a string generated with Moment.js' 'fromNow' function
    fromNow: Boolean

    # Returns the difference between this date and the current time. Defaults to "milliseconds" but you can also pass in as the measurement "years", "months", "weeks", "days", "hours", "minutes", and "seconds".
    difference: String

    # Configures the locale Moment.js will use to format the date.
    locale: String
  ): Date
  overview: UniqueViolationsJsonOverview
}

type UniqueViolationsJsonOverview {
  ids: UniqueViolationsJsonOverviewIds
  violations: UniqueViolationsJsonOverviewViolations
}

type UniqueViolationsJsonOverviewIds {
  all: [String]
  byImpact: UniqueViolationsJsonOverviewIdsByImpact
}

type UniqueViolationsJsonOverviewIdsByImpact {
  minor: [String]
  moderate: [String]
  serious: [String]
  critical: [String]
}

type UniqueViolationsJsonOverviewViolations {
  all: [UniqueViolationsJsonOverviewViolationsAll]
  byImpact: UniqueViolationsJsonOverviewViolationsByImpact
}

type UniqueViolationsJsonOverviewViolationsAll {
  description: String
  helpUrl: String
  impact: String
  instances: [UniqueViolationsJsonOverviewViolationsAllInstances]
  routes: [UniqueViolationsJsonOverviewViolationsAllRoutes]
  ruleId: String
  summary: String
  tags: [String]
}

type UniqueViolationsJsonOverviewViolationsAllInstances {
  any: [UniqueViolationsJsonOverviewViolationsAllInstancesAny]
  all: [UniqueViolationsJsonOverviewViolationsAllInstancesAll]
  impact: String
  html: String
  target: [String]
  failureSummary: String
  routes: [UniqueViolationsJsonOverviewViolationsAllInstancesRoutes]
}

type UniqueViolationsJsonOverviewViolationsAllInstancesAny {
  id: String
  relatedNodes: [UniqueViolationsJsonOverviewViolationsAllInstancesAnyRelatedNodes]
  impact: String
  message: String
}

type UniqueViolationsJsonOverviewViolationsAllInstancesAnyRelatedNodes {
  html: String
  target: [String]
}

type UniqueViolationsJsonOverviewViolationsAllInstancesAll {
  id: String
  impact: String
  message: String
}

type UniqueViolationsJsonOverviewViolationsAllInstancesRoutes {
  id: String
  path: String
}

type UniqueViolationsJsonOverviewViolationsAllRoutes {
  id: String
  path: String
}

type UniqueViolationsJsonOverviewViolationsByImpact {
  minor: [UniqueViolationsJsonOverviewViolationsByImpactMinor]
  moderate: [UniqueViolationsJsonOverviewViolationsByImpactModerate]
  serious: [UniqueViolationsJsonOverviewViolationsByImpactSerious]
  critical: [UniqueViolationsJsonOverviewViolationsByImpactCritical]
}

type UniqueViolationsTallyJson implements Node {
  id: ID!
  parent: Node
  children: [Node!]!
  internal: Internal!
  reportId(
    # Format the date using Moment.js' date tokens, e.g. 'date(formatString: "YYYY MMMM DD")'. See https://momentjs.com/docs/#/displaying/format/ for documentation for different tokens.
    formatString: String

    # Returns a string generated with Moment.js' 'fromNow' function
    fromNow: Boolean

    # Returns the difference between this date and the current time. Defaults to "milliseconds" but you can also pass in as the measurement "years", "months", "weeks", "days", "hours", "minutes", and "seconds".
    difference: String

    # Configures the locale Moment.js will use to format the date.
    locale: String
  ): Date
  tally: UniqueViolationsTallyJsonTally
}

type UniqueViolationsTallyJsonTally {
  byImpact: UniqueViolationsTallyJsonTallyByImpact
  byInstance: UniqueViolationsTallyJsonTallyByInstance
}

type UniqueViolationsTallyJsonTallyByImpact {
  minor: Int
  moderate: Int
  serious: Int
  critical: Int
}

type UniqueViolationsTallyJsonTallyByInstance {
  minor: Int
  moderate: Int
  serious: Int
  critical: Int
}

`;
