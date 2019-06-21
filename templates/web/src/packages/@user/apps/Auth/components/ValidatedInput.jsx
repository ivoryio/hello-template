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
  const _validateField = () => {
    for (let validation of validations) {
      const result = validation(value)
      if (result) {
        return result
      }
    }
    return ''
  }
  const showValidFeedback = (touched, errors) => {
    if (!showValid) {
      return null
    }
    if (touched[name] && !errors[name]) {
      return capitalizeFirstChar(showValid)
    }
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
          type={type}
          name={name}
          label={label}
          placeholder={placeholder}
          required={required}
          valid={showValidFeedback(touched, errors)}
          error={touched[name] && errors[name]}
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
