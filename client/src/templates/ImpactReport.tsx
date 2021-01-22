import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'

import { ViolationT } from '../_types'
import { getReportDate } from '../utils'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

type PropsT = {
  pageContext: any
}

const ImpactReport = ({ pageContext }: PropsT) => {

  console.log(pageContext)
  
  if (!pageContext) {
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
      <p>Violations for report date: {getReportDate(pageContext.reportId)}</p>
      
      {pageContext.data.map(violation => {
        return (
          <div key={violation.ruleId}>
            <hr />
            <h2>{violation.summary}</h2>
            <p>{violation.description} <a href={violation.helpUrl}>Learn&nbsp;more&nbsp;&gt;</a></p>
            <h3>Routes:</h3>
            <ul>
            {violation.routes.map(route => (
              <li key={route.id}>{route.path}</li>
            ))}
            </ul>
            <h3>Details:</h3>
            <ul>
            {violation.instances.map((instance, index) => (
              <li key={`${violation.ruleId}-${index}`}>
                <h4>{instance.routes[0].path}:</h4>
                <pre>{instance.html}</pre>
              </li>
            ))}
            </ul>
          </div>
        )
      })}

    </Layout>
  )
}

export default ImpactReport
