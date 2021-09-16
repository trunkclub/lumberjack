import fs from 'fs'

import { ImpactValue } from 'axe-core'

import { AUDIT_FOLDER } from './_constants'
import {
  FeatureViolationSummaryReport,
  RouteReport,
  RouteViolationSummaryReport,
  UniqueViolation,
  UniqueViolationNode,
  ViolationOverview,
  ViolationTally
} from '../lumberjack.types'

const violationGenerator = function * (reportId: string): Generator<RouteReport, void, null> {
  // look in audit folder
  const filenames = fs.readdirSync(`${AUDIT_FOLDER}/route-reports`)

  // fetch all json files
  for (const filename of filenames) {
    const file = fs.readFileSync(
      `${AUDIT_FOLDER}/route-reports/${filename}`,
      'utf8'
    )
    const data = JSON.parse(file)
    const reportData = data.filter((entry: RouteReport) => entry.reportId === reportId)

    yield reportData[0]
  }
}

/**
 * All utility functions related to combining and altering
 * violation data found in reports.
 *
 * @class Violations
 */
export class Violations {

  levels: ImpactValue[]

  constructor() {
    this.levels = ['critical', 'serious', 'moderate', 'minor']
  }

  // Generate unique violation data for a given report ID
  public getUniqueViolationData = (reportId: string): UniqueViolation[] => {
    const uniqueViolations: UniqueViolation[] = []

    for (const data of violationGenerator(reportId)) {
      if (data?.violations?.length >= 0) {
        for (const violation of data.violations) {
          // Update each node with CSS scrubbed classes and route info
          violation.nodes.forEach((node: UniqueViolationNode) => {
            // If any `nth-child` elements are found, those
            // violations can be combined into one instance
            const regex = /nth-child.[0-9]*./g
            node.target = [node.target[0].replace(regex, '')]
            node.routes = [data.route]
          })

          // Does this violation already exist in the uniqueViolations?
          const ruleIdEntry = uniqueViolations.find(entry => entry.id === violation.id)

          if (ruleIdEntry) {
            ruleIdEntry.routes.push(data.route)

            // Add all nodes to the entry for this rule ID
            ruleIdEntry.nodes = ruleIdEntry.nodes.concat(violation.nodes)
          } else {
            uniqueViolations.push({
              ...violation,
              routes: [data.route],
            })
          }
        }
      }
    }

    return uniqueViolations
  }

  // Organize violations by element and by impact
  public getSortedViolationData = async (reportId: string): Promise<ViolationOverview> => {
    const uniqueViolations = await this.getUniqueViolationData(reportId)

    const getIdsByImpact = (impact: ImpactValue): string[] => {
      const ids: string[] = []
      uniqueViolations.forEach(violation => {
        if (violation.impact === impact) {
          ids.push(violation.id)
        }
      })

      return ids
    }

    const violationData: ViolationOverview = {
      ids: {
        all: uniqueViolations.map(violation => violation.id),
        byImpact: {
          minor: getIdsByImpact('minor'),
          moderate: getIdsByImpact('moderate'),
          serious: getIdsByImpact('serious'),
          critical: getIdsByImpact('critical'),
        },
      },
      violations: {
        all: uniqueViolations,
        byImpact: {
          minor: uniqueViolations.filter(violation => violation.impact === 'minor'),
          moderate: uniqueViolations.filter(violation => violation.impact === 'moderate'),
          serious: uniqueViolations.filter(violation => violation.impact === 'serious'),
          critical: uniqueViolations.filter(violation => violation.impact === 'critical'),
        },
      },
    }

    return violationData
  }

  public getTallySummary = (violations: UniqueViolation[]): {
    totalElements: number
    totalInstances: number
  } => {

    const tallySummary = {
      totalElements: 0,
      totalInstances: 0,
    }

    if (!violations.length) {
      return tallySummary
    }

    for (const violation of violations) {

      tallySummary.totalInstances += violation.nodes.length

      const elements: { [key: string]: UniqueViolationNode } = {}

      violation.nodes.forEach(instance => {

        const { routes } = instance

        // TODO: Add a fuzzy match check here, so elements that are
        // mostly the same get grouped together for remediation
        // (eg. <span class="xyz1">one</span> and <span class="xyz1">two</span>)

        if (elements[instance.html] && elements[instance.html].routes) {
          elements[instance.html].routes.push(...routes)
        } else {
          elements[instance.html] = {
            ...instance,
            routes,
          }
        }
      })

      tallySummary.totalElements += Object.keys(elements).length
    }

    return tallySummary
  }

  /**
   * Tally violations by element and by instance
   *
   * @param {string} reportId
   * @returns {Promise<ViolationTally>}
   */
  public getTallyViolationData = async (reportId: string): Promise<ViolationTally> => {
    const uniqueViolations = await this.getUniqueViolationData(reportId)
    const tally = {
      byElement: {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0,
      },
      byInstance: {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0,
      },
    }

    for (const level of this.levels) {

      const violationsByImpact = uniqueViolations.filter(violation => violation.impact === level)
      const { totalElements = 0, totalInstances = 0 } = this.getTallySummary(violationsByImpact)

      tally.byElement[level] = totalElements
      tally.byInstance[level] = totalInstances
    }

    return tally
  }

  /**
   * Get basic by-route violation count
   *
   * @param {string} reportId
   * @returns {RouteViolationSummaryReport}
   */
  public getRouteData = (reportId: string): RouteViolationSummaryReport => {
    const routesWithoutViolations = []
    const routesWithViolations = []
    for (const data of violationGenerator(reportId)) {
      if (data?.route?.path) {
        if (data?.violations?.length) {
          routesWithViolations.push(data.route.path)
        } else {
          routesWithoutViolations.push(data.route.path)
        }
      }
    }

    const count = routesWithViolations.length + routesWithoutViolations.length

    console.log(`\n ${count} routes have data for this report ID. ${routesWithViolations.length} routes had one or more violations.\n`)

    return {
      numberChecked: count,
      with: routesWithViolations,
      without: routesWithoutViolations,
    }
  }

/**
 *
 *
 * @param {string} reportId
 * @returns {FeatureViolationSummaryReport}
 */
public getFeatureSummariesByReportId = (reportId: string): FeatureViolationSummaryReport => {
  const summary: FeatureViolationSummaryReport = {
    reportId: reportId,
    features: [],
  }

  for (const data of violationGenerator(reportId)) {
    if (data) {
      const featureIndex = summary.features.findIndex((feature) => {
        return feature.id === data.featureInfo?.id
      })

      if (featureIndex >= 0) {
        summary.features[featureIndex].details.push({
          needsManualCheck: data.needsManualCheck,
          route: data.route,
          violations: data.violations,
        })
      } else {
        summary.features.push({
          id: data.featureInfo.id,
          name: data.featureInfo.name,
          details: [{
            needsManualCheck: data.needsManualCheck,
            route: data.route,
            violations: data.violations,
          }],
          tally: {
            byImpact: {
              critical: 0,
              minor: 0,
              moderate: 0,
              serious: 0,
            },
          },
        })
      }
    }
  }

  const featuresWithTally = summary.features.map(feature => {
    let tally
    feature.details.forEach(detail => {
      tally = {
        byImpact: {
          minor: +detail.violations.filter(violation => violation.impact === 'minor').length,
          moderate: +detail.violations.filter(violation => violation.impact === 'moderate').length,
          serious: +detail.violations.filter(violation => violation.impact === 'serious').length,
          critical: +detail.violations.filter(violation => violation.impact === 'critical').length,
        },
      }
    })

    feature.tally = tally

    return feature
  })

  summary.features = featuresWithTally

  return {
    reportId: reportId,
    features: featuresWithTally,
  }
}
}
