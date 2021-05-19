import React from 'react'

import { ResponsiveBar } from '@nivo/bar'

import { Box } from '../../../pattern-library'

import { COLORS } from '../constants'

export type TallyChartDataT = {
  date: string,
  critical: number
  serious: number
  moderate: number
  minor: number
  none?: number
}

type PropsT = {
  data: TallyChartDataT[],
  dataTalliedLabel?: string
  showNone?: boolean
}

const BarChart = ({data, showNone=false, dataTalliedLabel='violations'}: PropsT) => {

  let barColors: any = {
    criticalColor: COLORS.critical,
    seriousColor: COLORS.serious,
    moderateColor: COLORS.moderate,
    minorColor: COLORS.minor,
  }

  if (showNone) {
    barColors.noneColor = COLORS.none
  }

  const dataWithColorValues = data.map(entry => {
    return {
      ...entry,
      ...barColors,
    }
  })
  const colorArray: string[] = Object.values(barColors)

  const keys = Object.keys(barColors).map(key => key.replace('Color', ''))

  return (
    <Box height='600px' width='100%' sx={{
      border: '1px solid #CCC',
    }}>
      <ResponsiveBar
        keys={keys}
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
          legend: `number of ${dataTalliedLabel}`,
          legendPosition: 'middle',
          legendOffset: -40
        }}
        borderColor='#FFF'
        borderWidth={1}
        colors={colorArray}
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
            itemOpacity: 1,
            symbolSize: 20,
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
