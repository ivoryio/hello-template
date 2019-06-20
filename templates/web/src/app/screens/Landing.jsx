import React from 'react'
import styled from 'styled-components'

import { Hello } from '@hello'
import { Flex } from '@kogaio/Responsive'

const Landing = () => (
  <Flex
    alignItems='center'
    flexDirection='column'
    justifyContent='center'
    width={1}>
    <Center>
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
  transform: translate(-50%, -50%);
`

Landing.propTypes = {}

export default Landing
