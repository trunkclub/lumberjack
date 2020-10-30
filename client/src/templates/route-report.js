import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'

const RouteReport = ({ pageContext }) => {
  const [reportData, setReportData] = useState(null)
  useEffect(() => {
    async function fetchData() {
      const reportFile = pageContext.file
      await fetch(reportFile)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          setReportData(data[0])
        })
    }

    fetchData()
  }, [pageContext.file])

  if (!reportData) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1>{reportData.featureInfo.name}</h1>
      <p><b>Route:</b> {reportData.route.path}</p>
      
      <hr />

      {reportData.violations.length ? (
        <div>{reportData.violations.length} {reportData.violations.length > 1 ? 'violations' : 'violation'} found at this route.</div>
      ) : (
        <p>No violations found for this route!</p>
      )}

      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export default RouteReport
