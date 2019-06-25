import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import { withAuthListener } from './navigation/withAuthListener'

const AuthContext = createContext()
export const AuthProvider = withAuthListener(
  ({ authed, children, currentUser, ...props }) => (
    <AuthContext.Provider value={{ authed, currentUser, ...props }}>
      {children}
    </AuthContext.Provider>
  )
)

AuthProvider.propTypes = {
  authed: PropTypes.bool,
  children: PropTypes.node,
  currentUser: PropTypes.object
}

export default AuthContext
