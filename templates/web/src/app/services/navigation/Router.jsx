import React, { useContext } from 'react'
import { Router } from '@reach/router'

import { Header } from 'app/components'
import { Flex } from '@kogaio/Responsive'
import AuthContext from '../AuthContext'
import { Dashboard, Auth as AuthRoute, NotFound } from 'app/screens'
import { ProtectedRoute, PublicRoute } from './components'

const AppRouter = () => {
  const { currentUser } = useContext(AuthContext)
  return (
    <Flex flexDirection='column' width={1}>
      {currentUser ? <Header user={currentUser} /> : null}
      <Router>
        <ProtectedRoute component={Dashboard} path='/' />
        <PublicRoute component={Contact} path='contact' />
        <AuthRoute path='auth' />
        <NotFound default />
      </Router>
    </Flex>
  )
}

const Contact = () => <div>Contact</div>

export default AppRouter
