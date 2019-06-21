import React, { useContext } from 'react'
import { Router } from '@reach/router'

import { Header } from 'app/components'
import { Flex } from '@kogaio/Responsive'
import AuthContext from '../AuthContext'
import { Landing, Auth, NotFound } from 'app/screens'
import { ProtectedRoute, PublicRoute } from './components'

const AppRouter = () => {
  const { currentUser } = useContext(AuthContext)
  return (
    <Flex flexDirection='column' width={1}>
      <Header user={currentUser} />
      <Router>
        <ProtectedRoute component={Test} path='/test' />
        <ProtectedRoute component={Landing} path='/' />
        <PublicRoute component={Auth} path='/auth' />
        <PublicRoute component={NotFound} default />
      </Router>
    </Flex>
  )
}

const Test = () => <div>Test</div>

export default AppRouter
