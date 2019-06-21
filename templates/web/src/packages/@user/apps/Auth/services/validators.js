import { emailRegex, passwordRegex } from './auth.helpers'

export const required = value => (!value ? 'Required' : null)

export const emailFormat = value =>
  emailRegex.test(value) ? '' : 'Invalid email address format'

export const passwordFormat = value =>
  passwordRegex.test(value) ? '' : 'Invalid password format'
