import React from 'react'
import PropTypes from 'prop-types'

import { Formik, Form } from 'formik'

import {
  Box,
  Button,
  Card,
  Flex,
  Image,
  Space,
  Touchable,
  Typography
} from '@kogaio'

import icons from '@user/assets/icons'
import api from '@user/services/user.dataservice'
import { getQueryParam } from '@shared-utils/funcs'
import { required, emailFormat } from '../services/validators'

import { ValidatedInput } from '../components'

const SignIn = ({
  authData,
  authState,
  navigate,
  onAuthEvent,
  onStateChange,
  ...props
}) => {
  if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) return null

  const _handleStateChange = (newState, params = null) => () =>
    onStateChange(newState, params)

  const _requestSignIn = async ({ email, password }, actions) => {
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

    function redirectToStoredPath () {
      const redirectPath = getQueryParam('redirectTo') || '/'
      return navigate(redirectPath, { replace: true })
    }
    function handleAuthError (err) {
      if (typeof err === 'object') {
        const { message, code } = err
        if (code === 'UserNotFoundException')
          return _handleStateChange('signUp', {
            email,
            password
          })()

        return setStatus(`* ${message}`)
      }
      setStatus(`* Error caught: ${err}`)
    }
  }

  return (
    <Flex
      alignItems='center'
      id='container-signin'
      justifyContent='center'
      {...props}>
      <Space mx={4} p={8}>
        <Card
          alignItems='center'
          variant='light'
          display='flex'
          flexDirection='column'
          width={{ xs: 1, sm: 2 / 3, md: 3 / 4, lg: 1 / 3 }}>
          <Image size={[120]} src={icons.logo} />
          <Space mt={1}>
            <Typography
              data-testid='signin-title'
              color='dark-gunmetal'
              fontWeight={2}
              textAlign='center'
              variant='h2'>
              Sign In Below!
            </Typography>
          </Space>
          <Box width={{ xs: 1, sm: 3 / 4, lg: 2 / 3 }}>
            <Formik
              initialValues={{ email: authData.email || '', password: '' }}
              onSubmit={_requestSignIn}
              render={({
                values: { email, password },
                status,
                handleSubmit,
                isSubmitting
              }) => (
                <Space mt={4}>
                  <Form noValidate onSubmit={handleSubmit}>
                    <ValidatedInput
                      autoComplete='username'
                      dataTestId='username-input-signin'
                      label='Email'
                      name='email'
                      placeholder='Email'
                      type='email'
                      validate={[required, emailFormat]}
                      value={email}
                    />
                    <ValidatedInput
                      autoComplete='current-password'
                      dataTestId='password-input-signin'
                      label='Password'
                      name='password'
                      placeholder='Password'
                      type='password'
                      validate={[required]}
                      value={password}
                    />
                    <Typography color='error' textAlign='center' variant='h6'>
                      {status}
                    </Typography>
                    <Space mt={4}>
                      <Button
                        data-testid='signin-button'
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        title='Sign In'
                        type='submit'
                        width={1}
                      />
                    </Space>
                  </Form>
                </Space>
              )}
            />
          </Box>
          <Space mt={3}>
            <Touchable
              data-testid='anchor-to-signup'
              effect='opacity'
              onClick={_handleStateChange('signUp')}
              width={1}>
              <Typography variant='link'>
                You do not have an account yet? Sign up!
              </Typography>
            </Touchable>
          </Space>
        </Card>
      </Space>
    </Flex>
  )
}

SignIn.propTypes = {
  authData: PropTypes.object,
  authState: PropTypes.string.isRequired,
  navigate: PropTypes.func,
  onAuthEvent: PropTypes.func,
  onStateChange: PropTypes.func
}

SignIn.defaultProps = {
  authState: 'signIn',
  authData: {}
}

export default SignIn
