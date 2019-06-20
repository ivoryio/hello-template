import React from 'react'
import PropTypes from 'prop-types'
import { Authenticator } from 'aws-amplify-react'

import { SignIn, SignUp } from './screens'

const AuthEntry = ({ currentUser }) =>
  !currentUser ? (
    <Authenticator authState='signIn' hideDefault>
      <SignIn />
      <SignUp />
    </Authenticator>
  ) : null

AuthEntry.propTypes = {
  currentUser: PropTypes.object
}

export default AuthEntry
