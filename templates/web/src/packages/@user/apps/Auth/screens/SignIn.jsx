import React from 'react'
import PropTypes from 'prop-types'
import { Auth } from 'aws-amplify'

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
import { ValidatedInput } from '../components'
import { getQueryParam } from '@shared-utils/funcs'
import { required, emailFormat } from '../services/validators'

const SignIn = ({
  authState,
  navigate,
  onAuthEvent,
  onStateChange,
  ...props
}) => {
  const _handleStateChange = (newState, params = null) => () =>
    onStateChange(newState, params)

  const _signIn = async ({ email, password }, actions) => {
    const { setStatus, setSubmitting } = actions
    setStatus(null)

    try {
      const redirectPath = getQueryParam('redirectTo') || '/'
      await Auth.signIn(email, password)
      navigate(redirectPath, { replace: true })
    } catch (err) {
      if (typeof err === 'object') {
        const { message, code } = err
        if (['NotFoundException', 'NotAuthorizedException'].includes(code)) {
          return setStatus('* Invalid email or password.')
        }
        return setStatus(`* ${message}`)
      }
      setStatus(`* Error caught: ${err}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) return null
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
              initialValues={{ email: '', password: '' }}
              onSubmit={_signIn}
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
  authState: PropTypes.string.isRequired,
  navigate: PropTypes.func,
  onAuthEvent: PropTypes.func,
  onStateChange: PropTypes.func
}

SignIn.defaultProps = {
  authState: 'signIn'
}

export default SignIn
