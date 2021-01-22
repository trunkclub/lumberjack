import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'

import Layout from '../components/Layout'

type PropsT = {
  pageContext: any
}

const FeatureReport = ({ pageContext }: PropsT) => {
  
  console.log(pageContext)

  let totalViolations = 0
  let routesWithViolations = []
  let routesWithoutViolations = []

  pageContext.details.forEach(detail => {
    totalViolations += detail.violations.length

    if (detail.violations.length === 0) {
      routesWithoutViolations.push(detail)
    } else {
      routesWithViolations.push(detail)
    }
  })

  console.log(routesWithViolations)

  return (
    <Layout>
      <h1>{pageContext.name}</h1>
      
      <h2>Route Summary</h2>

      <table>
        <tr>
          <th>Total Violations</th>
          <th>Routes With</th>
          <th>Routes Without</th>
          <th>% with Violations</th>
        </tr>
        <tr>
          <td>{totalViolations}</td>
          <td>{routesWithViolations.length}</td>
          <td>{routesWithoutViolations.length}</td>
          <td>{Math.round((routesWithViolations.length / pageContext.details.length)*100)}%</td>
        </tr>
      </table>

      <h2>Violations:</h2>

      {routesWithViolations.length === 0 ? (
        <p>No violations for this feature- well done!</p>
      ) : (
        <>
          {routesWithViolations.map(route => (
            <div>
              <h3>{route.route.path}</h3>
              <ul>
                {route.violations.map(detail => (
                  <li>
                    Issue: {detail.help} <a href={detail.helpUrl}>Learn more</a><br />
                    Impact: {detail.impact}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </Layout>
  )
}

export default FeatureReport
