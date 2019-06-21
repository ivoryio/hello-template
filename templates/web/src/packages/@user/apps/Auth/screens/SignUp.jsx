import React from 'react'
import { Auth } from 'aws-amplify'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import {
  Box,
  Button,
  Card,
  Dropdown,
  Flex,
  Image,
  Input,
  Space,
  Touchable,
  Typography
} from '@kogaio'

import icons from '@user/assets/icons'
import { ValidatedInput } from '../components'
import { required, emailFormat, passwordFormat } from '../services/validators'

const options = [
  {
    id: 'option-ro',
    name: 'Romania'
  },
  {
    id: 'option-ru',
    name: 'Russia'
  },
  {
    id: 'option-md',
    name: 'Moldova'
  }
]

const SignUp = ({ authState, onAuthEvent, onStateChange, ...props }) => {
  const _handleStateChange = (newState, params) => () => {
    onStateChange(newState, params)
  }

  const _signUp = async (values, actions) => {
    const { setStatus, setSubmitting } = actions
    setStatus(null)

    const { email, password, firstName, familyName, city, country } = values
    try {
      const newUser = await Auth.signUp({
        username: email,
        password,
        attributes: {
          name: firstName,
          'family_name': familyName,
          'custom:city': city,
          'custom:country': country
        }
      })
      
      if (newUser) {
        _handleStateChange('signIn', { username: newUser.username })()
      } else {
        setStatus(
          '* Unexpected error caught. Please try again in a few moments.'
        )
      }
    } catch (err) {
      if (typeof err === 'object') {
        const { message } = err
        return setStatus(`* ${message}`)
      }
      setStatus(`* Error caught: ${err}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (authState !== 'signUp') {
    return null
  }
  return (
    <Flex
      alignItems='center'
      id='container-signup'
      justifyContent='center'
      {...props}>
      <Space mx={4} p={8} pt={{ xs: 24, lg: 8 }}>
        <Card
          alignItems='center'
          variant='light'
          display='flex'
          flexDirection='column'
          width={{ xs: 1, sm: 3 / 4, md: 3 / 5, lg: 1 / 2 }}>
          <Image mx='auto' dimensions={[120]} src={icons.logo} />
          <Typography
            data-testid='signup-title'
            color='dark-gunmetal'
            fontWeight={2}
            textAlign='center'
            variant='h2'>
            Sign Up Below!
          </Typography>
          <Formik
            initialValues={{
              email: '',
              password: '',
              firstName: '',
              familyName: '',
              city: '',
              country: ''
            }}
            onSubmit={_signUp}
            render={({
              values: { email, password, firstName, familyName, city, country },
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              status
            }) => (
              <Space mt={4}>
                <Form noValidate onSubmit={handleSubmit}>
                  <Flex flexWrap='wrap' justifyContent='center'>
                    <Space px={{ lg: 3 }}>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='username'
                          dataTestId='email-input-signup'
                          label='Email'
                          name='email'
                          placeholder='Email'
                          required
                          showValid='Email validated!'
                          type='email'
                          validate={[required, emailFormat]}
                          value={email}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='current-password'
                          dataTestId='password-input-signup'
                          type='password'
                          placeholder='Password'
                          name='password'
                          value={password}
                          label='Password'
                          required
                          showValid='Password validated!'
                          validate={[required, passwordFormat]}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='first-name'
                          dataTestId='firstname-input-signup'
                          placeholder='First name'
                          value={firstName}
                          label='First Name'
                          name='firstName'
                          required
                          showValid='First name validated!'
                          validate={[required]}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <ValidatedInput
                          autoComplete='last-name'
                          dataTestId='lastname-input-signup'
                          label='Last Name'
                          name='familyName'
                          placeholder='Last name'
                          required
                          showValid='Last name validated!'
                          validate={[required]}
                          value={familyName}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <Input
                          dataTestId='city-input-signup'
                          placeholder='City'
                          value={city}
                          label='City'
                          name='city'
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </Box>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 1 / 2 }}>
                        <Dropdown
                          id='country-option-signup'
                          data-testid='country-option-signup'
                          label='Country'
                          name='country'
                          placeholder='Select Your Country'
                          onChange={handleChange('country')}
                          value={country}
                          width={1}>
                          {options.map(option => (
                            <Dropdown.Option
                              key={option.id}
                              value={option.name}>
                              {option.name}
                            </Dropdown.Option>
                          ))}
                        </Dropdown>
                      </Box>
                    </Space>
                    <Box width={1}>
                      <Typography color='error' textAlign='center' variant='h6'>
                        {status}
                      </Typography>
                    </Box>
                    <Space mt={4}>
                      <Box width={{ xs: 1, sm: 4 / 5, md: 3 / 4, lg: 3 / 7 }}>
                        <Button
                          data-testid='signup-button'
                          disabled={isSubmitting}
                          isLoading={isSubmitting}
                          title='Sign Up'
                          type='submit'
                          width={1}
                        />
                      </Box>
                    </Space>
                  </Flex>
                </Form>
              </Space>
            )}
          />
          <Space mt={4}>
            <Touchable
              data-testid='anchor-to-signin'
              effect='opacity'
              onClick={_handleStateChange('signIn')}>
              <Typography variant='link'>
                Already have an account? Sign in!
              </Typography>
            </Touchable>
          </Space>
        </Card>
      </Space>
    </Flex>
  )
}

SignUp.propTypes = {
  authState: PropTypes.string.isRequired,
  onAuthEvent: PropTypes.func,
  onStateChange: PropTypes.func
}

SignUp.defaultProps = {
  authState: 'signIn'
}

export default SignUp
