import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import BarChart from '../components/Charts/BarChart'

import Layout from '../components/Layout'
import ReportSummaries from '../components/ReportSummaries'
import SEO from '../components/SEO'

import { getReportDate } from '../utils'

type PropsT = {
  summaryData: any
  tallyData: any
}

const IndexPage = ({ summaryData, tallyData }: PropsT) => {

  const tallybyImpact = tallyData.map((data) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byImpact,
    }
  }).reverse()
  const tallyByTotalInstances = tallyData.map((data) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byInstance,
    }
  }).reverse()

  const featureNavData = summaryData.features.map(data => (
    {
      id: data.id,
      name: data.name,
    }
  ))

  return (
    <Layout navigation={featureNavData}>
      <SEO title="Lumberjack" />
      <h1>Accessibility Violation Trends</h1>

      <h2>Violations by Element</h2>
      <BarChart data={tallybyImpact} />

      <h2>Violations by Total Instances</h2>
      <BarChart data={tallyByTotalInstances} />

      <h2>Report-to-Report Trends</h2>
      <ReportSummaries tallyData={tallyData} />
    </Layout>
  )
}

export default props => (
  <StaticQuery
    query={graphql`
      query {
        allUniqueViolationsTallyJson(sort: {fields: reportId, order: DESC}) {
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
        allSummariesJson(sort: {fields: reportId, order: ASC}) {
          edges {
            node {
              features {
                name
                id
              }
            }
          }
        }
      }
    `}
    render={data => (
      <IndexPage
        summaryData={data.allSummariesJson.edges[0].node}
        tallyData={data.allUniqueViolationsTallyJson.nodes}
        {...props}
      />
    )}
  />
)
