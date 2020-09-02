import React from 'react'

import { getReportDate } from '../utils'

const calculateDifference = (thisWeekValue, lastWeekValue) => {

  let difference

  if (!lastWeekValue || (thisWeekValue === lastWeekValue)) {
    return null
  }

  difference = thisWeekValue - lastWeekValue

  if (difference > 0) {
    difference = '+' + difference
  }

  return difference
}

const ReportSummaries = ({tallyData}) => {
  return tallyData.map((data, index) => {

    const impacts = Object.keys(data.tally.byInstance)
    const next = index+1
    const lastEntry = tallyData[next] ? tallyData[next] : null

    const reportDate = getReportDate(data.reportId)

    return(
      <section className="impactSummary" id={data.reportId}>
        <h2>{reportDate}</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th width="40%">By Element</th>
              <th width="40%">By # of Instances</th>
            </tr>
          </thead>
          <tbody>
            {impacts.map((key) => {

              const numberByElement = Number(data.tally.byInstance[key])
              const previousByElement = lastEntry ? Number(lastEntry.tally.byImpact[key]) : null
              const differenceByElement = calculateDifference(numberByElement, previousByElement)

              const numberByInstances = Number(data.tally.byInstance[key])
              const previousByInstances = lastEntry ? Number(lastEntry.tally.byInstance[key]) : null
              const differenceByInstances = calculateDifference(numberByInstances, previousByInstances)

              return(
                <tr>
                  <th>{key}</th>
                  <td>
                    {data.tally.byImpact[key]}
                    {differenceByElement && (
                    <>{' '}<span className={'difference'  + (differenceByElement > 0 ? ' more' : ' less')}>{differenceByElement}</span></>  
                    )}
                  </td>
                  <td>
                    {numberByInstances}
                    {differenceByInstances && (
                    <>{' '}<span className={'difference'  + (differenceByInstances > 0 ? ' more' : ' less')}>{differenceByInstances}</span></>  
                    )}
                  </td>
                </tr>
            )})}
          </tbody>
        </table>
      </section>
    )
  })
}

export default ReportSummaries