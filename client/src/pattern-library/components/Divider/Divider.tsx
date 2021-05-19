import React from 'react'

import { Box, BoxProps } from '../../index'

type Props = BoxProps

const Divider = ({ ...rest }:Props ) => (
  <Box
    as="hr"
    my={4}
    sx={{
      borderColor: 'borders.decorative',
      borderStyle: 'solid',
      borderWidth: '1px 0 0 0',
    }}
    {...rest}
  />
)

export default Divider
