import React from 'react'
import PropTypes from 'prop-types'
import { Authenticator } from 'aws-amplify-react'

import { SignIn, SignUp } from './screens'

const Auth = props => (
  <Authenticator id='authenticator' authState='signIn' hideDefault>
    <SignIn {...props} />
    <SignUp {...props} />
  </Authenticator>
)

Auth.propTypes = {
  location: PropTypes.object,
  navigate: PropTypes.func
}

export default Auth
