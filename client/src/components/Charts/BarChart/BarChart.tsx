import React from 'react'

import { ResponsiveBar } from '@nivo/bar'

import { Box } from '../../../pattern-library'

import { COLORS } from '../constants'

const barColors = {
  criticalColor: COLORS.critical,
  seriousColor: COLORS.serious,
  moderateColor: COLORS.moderate,
  minorColor: COLORS.minor,
}

type TallySummary = {
  critical: number
  serious: number
  moderate: number
  minor: number
}

type TallyChartData = {
  date: string,
  reportId: string,
  tally: {
    byImpact: TallySummary
    byInstance: TallySummary
  }
}

type PropsT = {
  data: TallyChartData[]
}

const BarChart = ({data}: PropsT) => {

  const dataWithColorValues = data.map(entry => {
    return { ...entry, ...barColors }
  })

  return (
    <Box height='600px'>
      <ResponsiveBar
        keys={Object.keys(COLORS)}

        animate={true}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'number of violations',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        borderColor='#FFF'
        borderWidth={1}
        colors={[COLORS.critical, COLORS.serious, COLORS.moderate, COLORS.minor]}
        data={dataWithColorValues}
        groupMode='stacked'
        indexBy='date'
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={'#FFF'}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        motionStiffness={90}
        motionDamping={15}
        padding={0.3}
      />
    </Box>
  )
}

export default BarChart
