import React from 'react'

import { Flex } from '@kogaio/Responsive'
import Typography from '@kogaio/Typography'

const PLACEHOLDER = ({ ...props }) => (
  <Flex alignItems='center' justifyContent='center'>
    <Typography variant='h3' {...props}>
      Hello from PLACEHOLDER
    </Typography>
  </Flex>
)

PLACEHOLDER.propTypes = {}

export default PLACEHOLDER
