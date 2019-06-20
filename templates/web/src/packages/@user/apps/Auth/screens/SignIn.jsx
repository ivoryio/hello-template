import React from 'react'
import PropTypes from 'prop-types'
import { Auth } from 'aws-amplify'
import { navigate } from '@reach/router'
import Button from '@kogaio/Button'

import { Flex } from '@kogaio/Responsive'

const SignIn = ({ authState, setAuthState, ...props }) => {
  if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) {
    return null
  }

  const _signIn = async () => {
    try {
      await Auth.signIn('ioana.vasiliu+1@thinslices.com', '1234Ioana!')
      navigate('/profile')
    } catch (err) {
      console.error('* Error caught while signing in', err)
    }
  }

  return (
    <Flex alignItems='center' flexDirection='column' justifyContent='center'>
      <Button title='Sign In' onClick={_signIn} />
    </Flex>
  )
}

SignIn.propTypes = {
  authState: PropTypes.string,
  setAuthState: PropTypes.func
}

export default SignIn
