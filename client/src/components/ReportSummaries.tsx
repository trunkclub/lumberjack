import React from 'react'

import { Box, TableCell, Text } from '../pattern-library'

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

  const impacts = Object.keys(tallyData[0].tally.byImpact)
  return (
    <Box
      as="table"
      sx={{
        
        borderSpacing: '0.5rem 1rem',
        
        'tr td:nth-of-type(2n)': {
          borderRight: '0.75rem solid #FFF'
        },

      }}
    >
      <col />
      {/** @ts-ignore */}
      <colgroup span="2"></colgroup>
      {/** @ts-ignore */}
      <colgroup span="2"></colgroup>
      <thead>
        <tr>
          {/** @ts-ignore */}
          <th rowspan="2">Report Date</th>
          {impacts.map((impact) => (
            // @ts-ignore
            <th key={impact} colspan="2" scope="colgroup">{impact}</th>
          ))}
        </tr>
        <tr>
          <Text as="th" scope="col" variant="bodySmall">elements</Text>
          <Text as="th" scope="col" variant="bodySmall">instances</Text>
          <Text as="th" scope="col" variant="bodySmall">elements</Text>
          <Text as="th" scope="col" variant="bodySmall">instances</Text>
          <Text as="th" scope="col" variant="bodySmall">elements</Text>
          <Text as="th" scope="col" variant="bodySmall">instances</Text>
          <Text as="th" scope="col" variant="bodySmall">elements</Text>
          <Text as="th" scope="col" variant="bodySmall">instances</Text>
        </tr>
      </thead>
      <tbody>
      {tallyData.map((data, index) => {

        
        const previousDateEntry = tallyData[index+1] ?? null
        const reportDate = getReportDate(data.reportId)

        return(
          <tr
            id={data.reportId}
            key={data.reportId}
          >
            <Box as="th" scope="row" px={2}>{reportDate}</Box>

            
            {impacts.map((impact) => {

              const numberByElement = Number(data.tally.byImpact[impact])
              const previousByElement = previousDateEntry ? Number(previousDateEntry.tally.byImpact[impact]) : 0
              const differenceByElement = calculateDifference(numberByElement, previousByElement)

              const numberByInstances = Number(data.tally.byInstance[impact])
              const previousByInstances = previousDateEntry ? Number(previousDateEntry.tally.byInstance[impact]) : 0
              const differenceByInstances = calculateDifference(numberByInstances, previousByInstances)

              return(
                <>
                <TableCell minWidth="5rem">
                  {numberByElement}
                  {differenceByElement && (
                    <>
                      {' '}
                      <Text
                        as="span"
                        fontSize={0}
                        fontStyle="italic"
                        color={(differenceByElement > 0 ? 'trends.negative' : 'trends.positive')}
                      >
                        {differenceByElement}
                      </Text>
                    </>  
                  )}
                </TableCell>
                <TableCell minWidth="6rem">
                  {numberByInstances}
                  {differenceByInstances && (
                    <>
                      {' '}
                      <Text
                        as="span"
                        fontSize={0}
                        fontStyle="italic"
                        color={(differenceByInstances > 0 ? 'trends.negative' : 'trends.positive')}
                      >
                        {differenceByInstances}
                      </Text>
                    </>  
                  )}
                </TableCell>
              </>
            )})}
          </tr>
        )
      })}
      </tbody>
    </Box>
  )
}

export default ReportSummaries