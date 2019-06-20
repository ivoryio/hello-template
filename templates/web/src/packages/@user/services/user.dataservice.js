import { Auth } from 'aws-amplify'

async function getCurrentUser () {
  const response = await Auth.currentAuthenticatedUser()
  return response
}

async function signUp (data) {
  const response = await Auth.signUp(data)
  return response
}

async function signIn (email, password) {
  const response = await Auth.signIn(email, password)
  return response
}

async function signOut () {
  const response = await Auth.signOut()
  return response
}

export default {
  getCurrentUser,
  signUp,
  signIn,
  signOut
}
