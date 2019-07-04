import React from 'react'

import { Flex } from '@kogaio/Responsive'
import Typography from '@kogaio/Typography'

const PACKAGE_CAMELIZED = ({ ...props }) => (
  <Flex alignItems="center" justifyContent="center">
    <Typography variant="h3" {...props}>
      Hello from PACKAGE_CAMELIZED
    </Typography>
  </Flex>
)

PACKAGE_CAMELIZED.propTypes = {}

export default PACKAGE_CAMELIZED
