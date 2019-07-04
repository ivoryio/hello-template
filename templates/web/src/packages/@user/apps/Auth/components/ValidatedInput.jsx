import React from 'react'
import Input from '@kogaio/Input'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { capitalizeFirstChar } from '../services'

const ValidatedInput = ({
  name,
  validMessage,
  validate: validations,
  value,
  ...props
}) => {
  const _validateField = () =>
    validations.length
      ? validations.reduce((acc, fn) => acc || fn(value), '')
      : ''

  const showValidFeedback = (touched, errors) => {
    if (!validMessage) return null

    if (touched[name] && !errors[name]) return capitalizeFirstChar(validMessage)
  }

  return (
    <Field
      name={name}
      validate={_validateField}
      render={({ field, form: { touched, errors }, ...rest }) => (
        <Input
          {...field}
          {...rest}
          {...props}
          error={touched[name] && errors[name]}
          name={name}
          valid={showValidFeedback(touched, errors)}
        />
      )}
    />
  )
}

ValidatedInput.propTypes = {
  autoComplete: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validMessage: PropTypes.string,
  validate: PropTypes.arrayOf(PropTypes.func),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array
  ])
}

ValidatedInput.defaultProps = {
  type: 'text'
}

export default ValidatedInput
