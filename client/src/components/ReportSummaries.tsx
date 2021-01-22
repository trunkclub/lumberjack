import React from 'react'

import { Link } from 'gatsby'

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

type TallyT = {
  reportId: string
  numberOfRoutesChecked: number
  tally: {
    byInstance: {
      critical: number
      serious: number
      moderate: number
      minor: number
    }
    byImpact: {
      critical: number
      serious: number
      moderate: number
      minor: number
    }
  }
}

type PropsT = {
  tallyData: TallyT[]
}

const ReportSummaries = ({ tallyData }: PropsT) => {
  return (
    <>
      {tallyData.map((data, index) => {

        const impacts = Object.keys(data.tally.byInstance)
        const lastEntry = tallyData[index-1] ? tallyData[index-1] : null
        const reportDate = getReportDate(data.reportId)

        return(
          <section
            className="impactSummary"
            id={data.reportId}
            key={data.reportId}
          >
            <h2>{reportDate}</h2>

            <div>

              <div>
                <h3>Summary:</h3>
              </div>
              <div>
                <h3>Violations by Impact:</h3>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>By Element</th>
                      <th>By # of Instances</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impacts.map((impact) => {
        
                      const numberByElement = Number(data.tally.byInstance[impact])
                      const previousByElement = lastEntry ? Number(lastEntry.tally.byImpact[impact]) : null
                      const differenceByElement = calculateDifference(numberByElement, previousByElement)
        
                      const numberByInstances = Number(data.tally.byInstance[impact])
                      const previousByInstances = lastEntry ? Number(lastEntry.tally.byInstance[impact]) : null
                      const differenceByInstances = calculateDifference(numberByInstances, previousByInstances)
        
                      return(
                        <tr key={impact}>
                          <th>{impact}</th>
                          <td>
                            {data.tally.byImpact[impact]}
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
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export default ReportSummaries