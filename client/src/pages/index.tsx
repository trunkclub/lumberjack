import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import BarChart from '../components/Charts/BarChart'

import Layout from '../components/Layout'
import ReportSummaries from '../components/ReportSummaries'
import SEO from '../components/SEO'
import { Divider, Text } from '../pattern-library'

import { ImpactTallyT, SummaryReportT, TallyChartDataT, TallyReportT } from '../_types'

import { getReportDate } from '../utils'

type PropsT = {
  summaryData: SummaryReportT[]
  tallyData: TallyReportT[]
}

const IndexPage = ({ summaryData, tallyData }: PropsT) => {

  // TODO: Consolidate tallying functions with their BarCharts into dedicated components

  const tallybyImpact: TallyChartDataT[] = tallyData.map((data) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byImpact,
    }
  }).reverse()
  const tallyByTotalInstances: TallyChartDataT[] = tallyData.map((data) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byInstance,
    }
  }).reverse()

  const highestImpactPerRoute = (report: SummaryReportT): ImpactTallyT => {

    const tally = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
    }
    
    report.features.map((data) => {
    
      data.details.forEach(entry => {

        if (entry.violations) {

          const hasCritical = entry.violations.find(violation => {
            return violation.impact === 'critical'
          })
          const hasSerious = entry.violations.find(violation => {
            return violation.impact === 'serious'
          })
          const hasModerate = entry.violations.find(violation => {
            return violation.impact === 'moderate'
          })
          const hasMinor = entry.violations.find(violation => {
            return violation.impact === 'minor'
          })

          if (hasCritical) {
            tally.critical++
          } else if (hasSerious) {
            tally.serious++
          } else if (hasModerate) {
            tally.moderate++
          } else if (hasMinor) {
            tally.minor++
          }
        }
      })
    })

    return tally
  }

  const allRoutesByMostImpactfulViolation: TallyChartDataT[] = summaryData.map(data => {
    return {
      date: getReportDate(data.reportId),
      none: data.routes.without.length,
      ...highestImpactPerRoute(data),
    }
  }).reverse()

  return (
    <Layout>
      <SEO title="Accessibility trend data" />

      <h1>Accessibility Issue Trend Data</h1>
      <Text variant="body" as="p">The following is trend data collected from the last 10 reports (if available).</Text>

      <Divider />

      <h2>Violations by Element and Instance</h2>
      <Text variant="body" as="p">The following two charts count violations by individual element and by the times the element is rendered across routes checked.</Text>
      <Text variant="body" as="p">For example, let's say we had an  Input component that wasn't correctly labeled properly, and so it triggers a violation. It appears in a form in our app four times. The <b>by element</b> count would equal 1, and the <b>by instance</b> count would equal 4.</Text>
      <Text variant="body" as="p">This context can be helpful in prioritizing remediation, since addressing an element that is causing hundreds of violations will be more impactful than fixing an element causing five.</Text>

      <h3>Violations by Element</h3>
      <BarChart data={tallybyImpact} />

      <h3>Violations by Total Instances</h3>
      <BarChart data={tallyByTotalInstances} />

      <Divider />

      <h2>Most Impactful Violation on Every Route Checked</h2>
      <Text variant="body" as="p">This chart shows a helicopter view of all routes checked, and counts the highest-impact-level violation found for each route. If no programmatic violations are found for a given route, it is added to the <b>none</b> count. You should still check these routes manually.</Text>
      <Text variant="body" as="p">You may choose to add or remove routes from your audit over time, or some routes may not be available each time Lumberjack runs. These charts will help you guage the overall "accessibility health" of your app over time, but also catch issues in the audit run itself should they occur.</Text>

      <BarChart data={allRoutesByMostImpactfulViolation} dataTalliedLabel="routes checked" showNone={true} />

      <Divider />

      <h2>Report-to-Report Trends</h2>
      <ReportSummaries tallyData={tallyData} />
    </Layout>
  )
}

export default props => (
  <StaticQuery
    query={graphql`
      query {
        allUniqueViolationsTallyJson(sort: {fields: reportId, order: DESC}, limit: 10) {
          nodes {
            reportId
            tally {
              byImpact {
                critical
                minor
                moderate
                serious
              }
              byInstance {
                critical
                minor
                moderate
                serious
              }
            }
          }
        }
        allSummariesJson(sort: {fields: reportId, order: DESC}, limit: 10) {
          nodes {
            features {
              name
              id
              details {
                route {
                  path
                }
                violations {
                  impact
                }
              }
              tally {
                byImpact {
                  critical
                  minor
                  moderate
                  serious
                }
              }
            }
            routes {
              numberChecked
              with
              without
            }
            reportId
          }
        }
      }
    `}
    render={data => (
      <IndexPage
        summaryData={data.allSummariesJson.nodes}
        tallyData={data.allUniqueViolationsTallyJson.nodes}
        {...props}
      />
    )}
  />
)
