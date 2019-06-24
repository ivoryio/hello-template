import React from 'react'
import Input from '@ivoryio/kogaio/Input'
import PropTypes from 'prop-types'
import { Field } from 'formik'
import { capitalizeFirstChar } from '../services'

const ValidatedInput = ({
  autoComplete,
  dataTestId,
  name,
  type,
  label,
  placeholder,
  required,
  showValid,
  validate: validations,
  value
}) => {
  const _validateField = () =>
    validations.length
      ? validations.reduce((acc, fn) => acc || fn(value), '')
      : ''

  const showValidFeedback = (touched, errors) => {
    if (!showValid) return null

    if (touched[name] && !errors[name]) return capitalizeFirstChar(showValid)
  }

  return (
    <Field
      name={name}
      validate={_validateField}
      render={({ field, form: { touched, errors }, ...props }) => (
        <Input
          {...field}
          {...props}
          autoComplete={autoComplete}
          dataTestId={dataTestId}
          error={touched[name] && errors[name]}
          label={label}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type}
          valid={showValidFeedback(touched, errors)}
        />
      )}
    />
  )
}
ValidatedInput.propTypes = {
  autoComplete: PropTypes.string,
  dataTestId: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  showValid: PropTypes.string,
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
