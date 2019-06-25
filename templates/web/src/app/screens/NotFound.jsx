import React from 'react'
import styled from 'styled-components'

import { Box } from '@kogaio/Responsive'
import Typography from '@kogaio/Typography'

const NotFound = () => (
  <Container left='50%' position='absolute' top='50%'>
    <Typography m='auto' variant='h4'>
      Oops! 404. Not found.
    </Typography>
  </Container>
)

const Container = styled(Box)`
  transform: translateX(-50%);
`

export default NotFound
