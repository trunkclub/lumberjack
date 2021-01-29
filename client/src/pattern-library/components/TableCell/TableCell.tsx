import React from 'react'

import { Box, BoxProps } from '../../../pattern-library'

type Props = {
  children: React.ReactNode
} & BoxProps

const TableCell = ({ children, ...rest }: Props) => (
  <Box
    as="td"
    backgroundColor="backgrounds.faded"
    p={1}
    minWidth="8rem"
    {...rest}
  >
    {children}
  </Box>
)

export default TableCell
