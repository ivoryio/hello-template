import React from 'react'
import Button from '@kogaio/Button'

const SignUp = ({ authState, onStateChange }) => {
  if (!authState.includes('sign-up')) return null
  return (
    <div>
      <Button
        title='I want to sign in'
        onClick={() => onStateChange('sign-in')}
      />
    </div>
  )
}

export default SignUp
