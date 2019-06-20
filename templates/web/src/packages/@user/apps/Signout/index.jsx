import React from 'react'
import Button from '@kogaio/Button'
import { Auth } from 'aws-amplify'

const Signout = props => {
  const _signOut = async () => {
    await Auth.signOut().catch(err =>
      console.error('* Error caught while signing out', err)
    )
  }

  return (
    <Button
      color='white'
      onClick={_signOut}
      title='Sign out'
      variant='outline'
      width='fit-content'
      {...props}
    />
  )
}

export default Signout
