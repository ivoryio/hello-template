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

import { ValidatedInput } from '../components'
import { withSignIn } from '../services/authHoC'
import { required, emailFormat } from '../services/validators'

const SignIn = ({
  authData,
  authState,
  onAuthEvent,
  onStateChange,
  requestSignIn,
  ...props
}) => {
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
          <Image size={120} src={icons.logo} />
          <Space mt={1}>
            <Typography
              color='dark-gunmetal'
              fontWeight='bold'
              textAlign='center'
              variant='h2'>
              Sign In Below!
            </Typography>
          </Space>
          <Box width={{ xs: 1, sm: 3 / 4, lg: 2 / 3 }}>
            <Formik
              initialValues={{
                email: authData ? authData.email : '',
                password: ''
              }}
              onSubmit={requestSignIn}
              render={({
                handleSubmit,
                isSubmitting,
                status,
                values: { email, password }
              }) => (
                <Space mt={4}>
                  <Form onSubmit={handleSubmit} noValidate>
                    <ValidatedInput
                      autoComplete='signin-username'
                      id='username-input'
                      label='Email'
                      name='email'
                      placeholder='Email'
                      type='email'
                      validate={[required, emailFormat]}
                      value={email}
                    />
                    <ValidatedInput
                      autoComplete='signin-current'
                      id='password-input'
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
              effect='opacity'
              onClick={() => onStateChange('signUp')}
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
  authState: PropTypes.string,
  onAuthEvent: PropTypes.func,
  onStateChange: PropTypes.func,
  requestSignIn: PropTypes.func
}

SignIn.defaultProps = {
  authData: {}
}

export default withSignIn(SignIn)
