import React from 'react'

// @ts-ignore - FIXME
import Alert from '../../../images/Alert.svg'

import { Box } from '../../.'

type ImpactListItemT = {
  children: React.ReactNode
  isCritical: boolean
}

export const ImpactListItem = ({ children, isCritical }: ImpactListItemT) => {
  return (
    <Box
      as="li"
      my={2}
      py={1}
      sx={{
        listStyleType: 'none',
        position: isCritical ? 'relative' : null,
        '&::before': {
          content: isCritical ? `url(${Alert})` : null,
          display: 'block',
          height: '2rem',
          left: '-2.55rem',
          position: 'absolute',
          top: '0.25rem',
          width: '2rem',
        },
      }}
    >
      {children}
    </Box>
  )
}

type ImpactListT = {
  children: React.ReactNode
}

const ImpactList = ({ children }: ImpactListT) => {
  return (
    <Box
      as="ul"
      pl={2}
      sx={{
        borderColor: 'borders.decorative',
        borderStyle: 'solid',
        borderWidth: '0 0 0 1px',
      }}
    >
      {children}
    </Box>
  )
}

export default ImpactList
