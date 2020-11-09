import fs from 'fs'

import { AUDIT_FOLDER } from './_constants'
import {
  FeatureViolationSummaryReport,
  Impact,
  RouteReport,
  RouteViolationSummaryReport,
  UniqueViolation,
  ViolationNode,
  ViolationOverview,
  ViolationTally
} from './_types'

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
  // Generate unique violation data for a given report ID
  public getUniqueViolationData = (reportId: string): UniqueViolation[] => {
    const uniqueViolations: UniqueViolation[] = []

    for (const data of violationGenerator(reportId)) {
      if (data?.violations?.length >= 0) {
        for (const violation of data.violations) {
          // Does this violation already exist in the uniqueViolations?
          const ruleIdEntry = uniqueViolations.find(entry => entry.ruleId === violation.id)

          if (ruleIdEntry) {

            // If any `nth-child` elements are found, those
            // violations can be combined into one instance
            violation.nodes.forEach((node: ViolationNode) => {

              const regex = /nth-child.[0-9]*./g
              node.target = [node.target[0].replace(regex, '')]
              if (node.routes) {
                node.routes.push(data.route)
              } else {
                node.routes = [data.route]
              }
            })

            // Add all nodes to the entry for this rule ID
            ruleIdEntry.instances = ruleIdEntry.instances.concat(violation.nodes)
          } else {
            uniqueViolations.push({
              description: violation.description,
              helpUrl: violation.helpUrl,
              impact: violation.impact,
              instances: violation.nodes,
              ruleId: violation.id,
              summary: violation.help,
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

    const getIdsByImpact = (impact: Impact): string[] => {
      const ids: string[] = []
      uniqueViolations.forEach(violation => {
        if (violation.impact === impact) {
          ids.push(violation.ruleId)
        }
      })

      return ids
    }

    const violationData: ViolationOverview = {
      ids: {
        all: uniqueViolations.map(violation => violation.ruleId),
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

  public countViolationsByInstance = (violations: UniqueViolation[], impact: Impact): number => {
    const violationsForImpactLevel = violations.filter(violation => violation.impact === impact)
    let numberOfInstances = 0

    violationsForImpactLevel.forEach(violation => {
      numberOfInstances += violation.instances.length
    })

    return numberOfInstances
  }

  /**
   * Tally violations by element and by impact
   *
   * @param {string} reportId
   * @returns {Promise<ViolationTally>}
   */
  public getTallyViolationData = async (reportId: string): Promise<ViolationTally> => {
    const uniqueViolations = await this.getUniqueViolationData(reportId)

    const tally = {
      byImpact: {
        minor: uniqueViolations.filter(violation => violation.impact === 'minor').length,
        moderate: uniqueViolations.filter(violation => violation.impact === 'moderate').length,
        serious: uniqueViolations.filter(violation => violation.impact === 'serious').length,
        critical: uniqueViolations.filter(violation => violation.impact === 'critical').length,
      },
      byInstance: {
        minor: this.countViolationsByInstance(uniqueViolations, 'minor'),
        moderate: this.countViolationsByInstance(uniqueViolations, 'moderate'),
        serious: this.countViolationsByInstance(uniqueViolations, 'serious'),
        critical: this.countViolationsByInstance(uniqueViolations, 'critical'),
      },
    }

    return tally
  }

  /**
   * Get basic by-route violation count
   *
   * @param {string} reportId
   * @returns {Promise<RouteViolationSummaryReport>}
   */
  public getRouteData = async (reportId: string): Promise<RouteViolationSummaryReport> => {
    let count = 0
    let routesWithoutViolations = []
    let routesWithViolations = []
    for (const data of violationGenerator(reportId)) {
      count++
      if (data.violations.length) {
        routesWithViolations.push(data.route.path)
      } else {
        routesWithoutViolations.push(data.route.path)
      }
    }

    console.log(`\n${count} routes have data for this report ID. ${routesWithViolations.length} routes had one or more violations.\n`)

    console.log('\nRoutes with violations: ')
    for (const route of routesWithViolations) {
      console.log(route)
    }

    console.log('\nRoutes without violations: ')
    for (const route of routesWithoutViolations) {
      console.log(route)
    }

    return {
      numberChecked: count,
      with: routesWithViolations,
      without: routesWithoutViolations,
    }
  }


  public getFeatureSummariesByReportId = async (reportId: string): Promise<FeatureViolationSummaryReport> => {

    const summary: FeatureViolationSummaryReport = {
      reportId: reportId,
      features: [],
    }

    for (const data of violationGenerator(reportId)) {

      const featureIndex = summary.features.findIndex((feature, index) => {
        return feature.id === data.featureInfo.id
      })

      if (featureIndex >= 0) {
        summary.features[featureIndex].details.push({
          needsManualCheck: data.needsManualCheck,
          route: data.route,
          violations: data.violations,
        })
      } else {
        summary.features.push({
          ...data.featureInfo,
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
          }
        })
      }
    }

    summary.features.forEach(feature => {
      feature.details.forEach(detail => {
        feature.tally = {
          byImpact: {
            minor: detail.violations.filter(violation => violation.impact === 'minor').length,
            moderate: detail.violations.filter(violation => violation.impact === 'moderate').length,
            serious: detail.violations.filter(violation => violation.impact === 'serious').length,
            critical: detail.violations.filter(violation => violation.impact === 'critical').length,
          },
        }
      })
    })

    console.log('\n')

    return summary
  }
}
