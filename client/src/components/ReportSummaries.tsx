import React from 'react'

import { TallyReport } from '../../../lumberjack.types'

import { Box, Text } from '../pattern-library'

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

type PropsT = {
  tallyData: TallyReport[]
}

const ReportSummaries = ({ tallyData }: PropsT): React.ReactElement => {
  const impacts = Object.keys(tallyData[0].tally.byImpact)
  return (
    <Box
      as="table"
      sx={{
        borderCollapse: 'collapse',
        th: {
          fontSize: 0,
          fontWeight: 'normal',
          textTransform: 'uppercase',
        },
      }}
    >
      <Box
        as="thead"
        sx={{
          borderColor: 'borders.division',
          borderStyle: 'solid',
          borderWidth: '0 0 1px',
        }}
      >
        <tr>
          <Box
            variant="smallHeadline"
            as="th"
            scope="col"
          >
            Report Date
          </Box>
          <Box
            variant="smallHeadline"
            as="th"
            scope="col"
          >
            Impact
          </Box>
          <Box
            variant="smallHeadline"
            as="th"
            px={2}
            scope="col"
            width="9rem"
            sx={{
              textAlign: 'left',
            }}
          >
            By Element
          </Box>
          <Box
            variant="smallHeadline"
            as="th"
            px={2}
            scope="col"
            width="12rem"
            sx={{
              textAlign: 'left',
            }}
          >
            By # of Instances
          </Box>
        </tr>
      </Box>

      {tallyData.map((data, index) => {
        const previousDateEntry = tallyData[index + 1] ?? null
        const reportDate = getReportDate(data.reportId)

        return (
          <Box
            key={`section_${index}`}
            as="tbody"
            sx={{
              borderColor: 'borders.decorative',
              borderStyle: 'solid',
              borderWidth: '0 0 1px',
            }}
          >
            {impacts.map((impact, index) => {
              const numberByElement = Number(data.tally.byImpact[impact])
              const previousByElement = previousDateEntry ? Number(previousDateEntry.tally.byImpact[impact]) : 0
              const differenceByElement = calculateDifference(numberByElement, previousByElement)

              const numberByInstances = Number(data.tally.byInstance[impact])
              const previousByInstances = previousDateEntry ? Number(previousDateEntry.tally.byInstance[impact]) : 0
              const differenceByInstances = calculateDifference(numberByInstances, previousByInstances)

              return (
                <tr>
                  {index === 0 && (
                    <Box
                      as="th"
                      scope="row"
                      rowSpan={4}
                      px={2}
                    >{reportDate}</Box>
                  )}
                  <Box
                    as="th"
                    px={2}
                    scope="row"
                    sx={{
                      borderColor: 'borders.decorative',
                      borderStyle: 'solid',
                      borderWidth: '0 0 1px',
                      textAlign: 'right',
                    }}
                  >
                    {impact}
                  </Box>
                  <Box
                    as="td"
                    px={2}
                    py={1}
                    sx={{
                      borderColor: 'borders.decorative',
                      borderStyle: 'solid',
                      borderWidth: '0 0 1px',
                    }}
                  >
                    {numberByElement}
                    {differenceByElement && (
                      <>
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
                  </Box>
                  <Box
                    as="td"
                    px={2}
                    py={1}
                    sx={{
                      borderColor: 'borders.decorative',
                      borderStyle: 'solid',
                      borderWidth: '0 0 1px',
                    }}
                  >
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
                  </Box>
                </tr>
              )
            })}
          </Box>
        )
      })}
    </Box>
  )
}

export default ReportSummaries
