import React from 'react'
import PropTypes from 'prop-types'

const PublicRoute = ({ children, component: Component, ...rest }) => (
  <Component {...rest}>{children}</Component>
)

PublicRoute.propTypes = {
  children: PropTypes.node,
  component: PropTypes.func
}

export default PublicRoute
