import React from 'react'
import PropTypes from 'prop-types'
import { Authenticator } from 'aws-amplify-react'

import { SignIn, SignUp } from './screens'
import { getQueryParam } from '@shared-utils/funcs'

const Auth = props => (
  <Authenticator
    id='authenticator'
    onStateChange={newState => props.navigate(`/auth?state=${newState}`)}
    authState={getQueryParam('state')}
    hideDefault>
    <SignIn {...props} />
    <SignUp {...props} />
  </Authenticator>
)

Auth.propTypes = {
  location: PropTypes.object,
  navigate: PropTypes.func
}

export default Auth
