import React from 'react'
import { Location } from '@reach/router'

export const withLocation = Component => props => (
  <Location>
    {({ location }) => <Component location={location} {...props} />}
  </Location>
)
