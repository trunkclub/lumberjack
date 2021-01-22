import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import Chart from '../components/Chart'
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
  })
  const tallyByTotalInstances = tallyData.map((data) => {
    return {
      date: getReportDate(data.reportId),
      ...data.tally.byInstance,
    }
  })

  const featureNavData = summaryData.features.map(data => (
    {
      id: data.id,
      name: data.name,
    }
  ))

  const reportIdNavData = tallyData.map(data => (
    {
      id: data.reportId,
      name: getReportDate(data.reportId),
    }
  ))

  const navigationData = {
    byFeature: featureNavData,
    byReportId: reportIdNavData,
  }

  return (
    <Layout navigation={navigationData}>
      <SEO title="Lumberjack" />
      <h1>Accessibility Violation Trends</h1>
      
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
        allSummariesJson(sort: {fields: reportId, order: DESC}) {
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
