import React from 'react'

import { Flex } from '@kogaio/Responsive'
import Typography from '@kogaio/Typography'

const MODULE_CAMELIZED = ({ ...props }) => (
  <Flex alignItems="center" justifyContent="center">
    <Typography variant="h3" {...props}>
      Hello from MODULE_CAMELIZED
    </Typography>
  </Flex>
)

MODULE_CAMELIZED.propTypes = {}

export default MODULE_CAMELIZED
