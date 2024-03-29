import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import { BarChart, TallyChartData } from '../components/Charts/BarChart'

import Layout from '../components/Layout'
import ReportSummaries from '../components/ReportSummaries'
import SEO from '../components/SEO'
import { Box, Button, Divider, Flex, Heading, Modal, Text } from '../pattern-library'

import {
  ImpactTally,
  SummaryReport,
  TallyReport
} from '../../../lumberjack.types'

import { getReportDate } from '../utils'

type PropsT = {
  summaryData: SummaryReport[]
  tallyData: TallyReport[]
}

const IndexPage = ({ summaryData, tallyData }: PropsT): React.ReactElement => {

  const [ routeContextIsOpen, setRouteContextIsOpen ] = React.useState(false)
  const [ violationContextIsOpen, setViolationContextIsOpen ] = React.useState(false)

  // TODO: Consolidate tallying functions with their BarCharts into dedicated components

  const tallybyElement: TallyChartData[] = tallyData.map((data) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byElement,
    }
  }).reverse()
  const tallyByTotalInstances: TallyChartData[] = tallyData.map((data) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byInstance,
    }
  }).reverse()

  const highestImpactPerRoute = (report: SummaryReport): ImpactTally => {
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

  const allRoutesByMostImpactfulViolation: TallyChartData[] = summaryData.map(data => {
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

      <Box mb={2}>
        <Heading
          variant="standardHeadline"
          as="h2"
          display="inline-block"
          mr={1}
        >
          Violations by Element and Instance
        </Heading>
        <Button
          variant="link"
          onClick={() => { setViolationContextIsOpen(true)}}
        >
          Learn more about this data
        </Button>
      </Box>
      <Modal
        aria={{labelledby: 'violationContext'}}
        isOpen={violationContextIsOpen}
        handleCloseModal={() => { setViolationContextIsOpen(false)}}
        onRequestClose={() => { setViolationContextIsOpen(false)}}
      >
        <h2 id="violationContext">What does "By Element" and "By Instance" mean?</h2>
        <Text variant="body" as="p">These two charts count violations by individual element and by the times the element is rendered across routes checked.</Text>
        <Text variant="body" as="p">For example, let's say we had an  Input component that wasn't correctly labeled properly, and so it triggers a violation. It appears in a form in our app four times. The <b>by element</b> count would equal 1, and the <b>by instance</b> count would equal 4.</Text>
        <Text variant="body" as="p">This context can be helpful in prioritizing remediation, since addressing an element that is causing hundreds of violations will be more impactful than fixing an element causing five.</Text>
      </Modal>

      
          <h3>Violations by Element</h3>
          <BarChart data={tallybyElement} />
          <h3>Violations by Total Instances</h3>
          <BarChart data={tallyByTotalInstances} />
      
      <Divider />

      <Box mb={2}>
        <Heading
          variant="standardHeadline"
          as="h2"
          display="inline-block"
          mr={1}
        >
          Most Impactful Violation on Every Route Checked
        </Heading>
        <Button
          variant="link"
          onClick={() => { setRouteContextIsOpen(true)}}
        >
          Learn more about this data
        </Button>
      </Box>
      <Modal
        aria={{labelledby: 'impactfulContext'}}
        isOpen={routeContextIsOpen}
        handleCloseModal={() => { setRouteContextIsOpen(false)}}
        onRequestClose={() => { setRouteContextIsOpen(false)}}
      >
        <h2 id="impactfulContext">What does "Most Impactful Violation" mean?</h2>
        <Text variant="body" as="p">This chart shows a helicopter view of all routes checked, and counts the highest-impact-level violation found for each route. If no programmatic violations are found for a given route, it is added to the <b>none</b> count. You should still check these routes manually.</Text>
        <Text variant="body" as="p">You may choose to add or remove routes from your audit over time, or some routes may not be available each time Lumberjack runs. These charts will help you gauge the overall "accessibility health" of your app over time, but also catch issues in the audit run itself should they occur.</Text>
      </Modal>

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
              byElement {
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
