import React from 'react'
import PropTypes from 'prop-types'

const PublicRoute = ({ component: Component, ...rest }) => (
  <Component {...rest} />
)

PublicRoute.propTypes = {
  component: PropTypes.func
}

export default PublicRoute
