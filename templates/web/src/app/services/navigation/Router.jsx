import React, { useContext } from 'react'
import { Router } from '@reach/router'

import { Header } from 'app/components'
import { Flex } from '@kogaio/Responsive'
import AuthContext from '../AuthContext'
import { Landing, Auth as AuthRoute, NotFound } from 'app/screens'
import { ProtectedRoute, PublicRoute } from './components'

const AppRouter = () => {
  const { currentUser } = useContext(AuthContext)
  return (
    <Flex flexDirection='column' width={1}>
      <Header user={currentUser} />
      <Router>
        <ProtectedRoute component={Landing} path='/' />
        <PublicRoute component={Contact} path='contact' />
        <AuthRoute path='auth' />
        <NotFound default />
      </Router>
    </Flex>
  )
}

const Contact = () => <div>Contact</div>

export default AppRouter
