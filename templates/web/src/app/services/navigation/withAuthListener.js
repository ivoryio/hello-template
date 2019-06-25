import React, { useCallback, useEffect, useState } from 'react'
import Auth from '@aws-amplify/auth'
import { Hub } from '@aws-amplify/core'
import { navigate } from '@reach/router'

export const withAuthListener = Component => props => {
  const { currentUser, fetchUser } = useAuth()

  useEffect(() => {
    fetchUser() // * on first load
  }, [fetchUser])

  useEffect(() => {
    Hub.listen('auth', checkAuthedUser, 'authHandler')
    return () => Hub.remove('auth', checkAuthedUser)

    async function checkAuthedUser (event) {
      const { event: eventName } = event.payload
      await fetchUser()
      if (eventName === 'signOut') navigate('/auth', { replace: true })
    }
  }, [fetchUser])

  if (currentUser === undefined) return null
  return <Component currentUser={currentUser} authed={!!currentUser} {...props} />
}

function useAuth () {
  const [currentUser, storeCurrentUser] = useState()

  const _clearStoredUser = () => storeCurrentUser(null)

  const fetchUser = useCallback(async () => {
    try {
      const currUser = await Auth.currentAuthenticatedUser()
      if (currUser) storeCurrentUser(currUser)
    } catch (err) {
      _clearStoredUser()
      console.warn(`* [auth] Caught while fetching user. Issue: ${err}.`)
    }
  }, [])

  return { currentUser, fetchUser }
}
