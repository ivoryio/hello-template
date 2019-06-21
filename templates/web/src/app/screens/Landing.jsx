import React from 'react'
import styled from 'styled-components'
import { Flex } from '@kogaio/Responsive'
import Typography from '@kogaio/Typography'

import { Hello } from '@hello'

const Landing = () => (
  <Flex
    alignItems='center'
    flexDirection='column'
    justifyContent='center'
    width={1}>
    <Center>
      <Typography variant='h3'>
        Welcome to landing.<Typography variant='h5'>Fun fact:</Typography>
      </Typography>
      <Hello />
    </Center>
  </Flex>
)

const Center = styled(Flex)`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  left: 50%;
  position: absolute;
  top: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
`

Landing.propTypes = {}

export default Landing
