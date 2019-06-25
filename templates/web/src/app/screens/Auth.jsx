import React from 'react'
import styled from 'styled-components'
import { Flex } from '@kogaio/Responsive'

import { Auth } from '@user'

const AuthScreen = props => (
  <AuthContainer>
    <Auth {...props} />
  </AuthContainer>
)

const AuthContainer = styled(Flex)`
  align-items: center;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;

  ${'' /* targets authenticator wrapper */}
  & > div:first-child {
    width: 100%;
  }
`

export default AuthScreen
