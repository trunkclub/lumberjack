import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import Chart from '../components/chart'
import Layout from '../components/layout'
import ReportSummaries from '../components/reportSummaries'
import SEO from '../components/seo'

import { getReportDate } from '../utils'

const IndexPage = ({ tallyData }) => {

  const tallybyImpact = tallyData.map((data, index) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byImpact,
    }
  })
  const tallyByTotalInstances = tallyData.map((data, index) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byInstance,
    }
  })

  const navigationData = tallyData.map(data => {
    return {
      reportId: data.reportId,
      date: getReportDate(data.reportId),
    }
  })

  return (
    <Layout navigation={navigationData} showHome={false}>
      <SEO title="Lumberjack" />
      <h1>Customer App Violation Trends</h1>
      <div className="intro">
        <p>These charts aim to show the volume of accessibility violations in the application, and shows violations <b>By Element</b> and <b>By Total Instances</b>.</p>
        <p>If an element appears on a page 4 times, its <b>By Element</b> count would be 1, and its <b>By Total Instances</b> count would be 4.</p>
      </div>
      <h2>Violations by Element</h2>
      <Chart data={tallybyImpact} />

      <h2>Violations by Total Instances</h2>
      <Chart data={tallyByTotalInstances} />

      <ReportSummaries tallyData={tallyData} />
    </Layout>
  )
}

export default props => (
  <StaticQuery
    query={graphql`
      query {
        allUniqueViolationsTallyJson {
          nodes {
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
            reportId
          }
        }
      }
    `}
    render={data => <IndexPage tallyData={data.allUniqueViolationsTallyJson.nodes} {...props} />}
  />
)
