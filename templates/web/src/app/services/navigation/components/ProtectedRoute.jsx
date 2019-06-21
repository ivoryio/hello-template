import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from '@reach/router'

import AuthContext from '../../AuthContext'
import { withLocation } from '../withLocation'

const ProtectedRoute = ({
  component: Component,
  location: { pathname, ...location },
  ...rest
}) => (
  <AuthContext.Consumer>
    {({ currentUser }) =>
      currentUser ? (
        <Component {...rest} />
      ) : (
        <Redirect
          from={pathname}
          to={pathname.length > 1 ? `/auth?redirectTo=${pathname}` : '/auth'}
          noThrow
        />
      )
    }
  </AuthContext.Consumer>
)

ProtectedRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.object
}

export default withLocation(ProtectedRoute)
