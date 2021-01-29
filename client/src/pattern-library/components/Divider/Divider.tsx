import React from 'react'

import { Box, BoxProps } from '../../index'

type Props = BoxProps

const Divider = ({ ...rest }:Props ) => (
  <Box as="hr" {...rest} />
)

export default Divider
