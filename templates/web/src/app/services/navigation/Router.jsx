import React from 'react'
import { Flex } from '@kogaio/Responsive'
import { Router } from '@reach/router'

import { Header } from 'app/components'
import { Landing, NotFound } from 'app/screens'

const AppRouter = () => (
  <Flex flexDirection='column' width={1}>
    <Header />
    <Router>
      <Landing path='/' />
      <NotFound default />
    </Router>
  </Flex>
)

AppRouter.propTypes = {}

export default AppRouter
