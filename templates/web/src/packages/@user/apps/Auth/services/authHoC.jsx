/* eslint react/prop-types: 0 */
import React from 'react'
import api from '@user/services/user.dataservice'
import { getQueryParam } from '@shared-utils/funcs'

export const withSignIn = SignIn => ({ onStateChange, navigate, ...props }) => {
  const signIn = async ({ email, password }, actions) => {
    const { setStatus, setSubmitting } = actions
    setStatus(null)
    try {
      await api.signIn(email, password)
      redirectToStoredPath()
    } catch (err) {
      handleAuthError(err)
    } finally {
      setSubmitting(false)
    }

    function handleAuthError (err) {
      if (typeof err === 'object') {
        const { message, code } = err
        if (code === 'UserNotFoundException')
          return onStateChange('signUp', {
            email,
            password
          })

        return setStatus(`* ${message}`)
      }
      setStatus(`* Error caught: ${err}`)
    }
  }

  function redirectToStoredPath () {
    const redirectPath = getQueryParam('redirectTo') || '/'
    return navigate(redirectPath, { replace: true })
  }

  return (
    <SignIn onStateChange={onStateChange} requestSignIn={signIn} {...props} />
  )
}

export const withSignUp = SignUp => ({ onStateChange, ...props }) => {
  const signUp = async (values, actions) => {
    const { setStatus, setSubmitting } = actions
    setStatus(null)

    const { email, password, firstName, familyName, city, country } = values
    try {
      const response = await api.signUp({
        username: email,
        password,
        attributes: {
          name: firstName,
          family_name: familyName /* eslint camelcase: 0 */,
          'custom:city': city,
          'custom:country': country
        }
      })

      if (response) onStateChange('signIn', { email: response.user.username })
      else setStatus('* Unexpected error caught. Please try again.')
    } catch (err) {
      if (typeof err === 'object') return setStatus(`* ${err.message}`)
      setStatus(`* Error caught: ${err}`)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <SignUp onStateChange={onStateChange} requestSignUp={signUp} {...props} />
  )
}
