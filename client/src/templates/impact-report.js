import React, { useEffect, useState } from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import UniqueViolationsSet from '../components/UniqueViolations/components/UniqueViolationsSet/UniqueViolationsSet.js'

const ImpactReport = ({ data, pageContext }) => {
  const [reportData, setReportData] = useState(null)
  useEffect(() => {
    async function fetchData() {
      const reportFile = data.allFile.edges[0].node.publicURL
      await fetch(reportFile)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          setReportData(data[0].overview.violations.byImpact[pageContext.impact.toLowerCase()])
        })
    }

    fetchData()
  }, [data.allFile.edges, pageContext.impact])

  if (!reportData) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO title={`Lumberjack : ${pageContext.impact} Violations`} />
      <h1>{pageContext.impact} Violations</h1>

      {reportData.length ? (
          <>
            <p>Violations with the following IDs were found:</p>
            <ul>
              {
                reportData.map((data, index) => {
                  return <li key={`issue-TOC--${index+1}`}><a href={`#${data.ruleId}`}>{data.ruleId}</a></li>
                  
                })
              }
            </ul>

            <hr />
            
            <UniqueViolationsSet reportData={reportData} />
          </>
        ) : (
          <p>There are currently no {pageContext.impact.toLowerCase()} violations found via Axe. Well done!</p>
        )
      }
    </Layout>
  )
}

export default ImpactReport

export const query = graphql`
  query GetUniqueViolationFileName {
    allFile(filter: {name: {eq: "uniqueViolations"}}) {
      edges {
        node {
          publicURL
        }
      }
    }
  }
`