import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import { withAuthListener } from './navigation/withAuthListener'
const AuthContext = createContext()

export const AuthProvider = withAuthListener(
  ({ children, currentUser, ...props }) => (
    <AuthContext.Provider value={{ currentUser, ...props }}>
      {children}
    </AuthContext.Provider>
  )
)

AuthProvider.propTypes = {
  children: PropTypes.node
}

export default AuthContext
