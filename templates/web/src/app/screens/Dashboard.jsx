import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { Flex } from '@kogaio/Responsive'

import { Hello } from '@hello'

const Dashboard = ({
  currentUser: {
    attributes: { name: firstName }
  }
}) => (
  <Flex
    alignItems='center'
    flexDirection='column'
    justifyContent='center'
    width={1}>
    <Center>
      <Hello name={firstName} />
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

Dashboard.propTypes = {
  currentUser: PropTypes.object.isRequired
}

export default Dashboard
