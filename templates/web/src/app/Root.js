import React from 'react'
import { themeFactory } from '@kogaio'
import { ApolloProvider } from 'react-apollo'
import { ThemeProvider } from 'styled-components'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'

import { GlobalStyle } from 'assets/GlobalStyle'
import Router from './services/navigation/Router'
import { defaultClient } from './services/graphql'
import { AuthProvider } from './services/AuthContext'

const Root = () => (
  <ApolloProvider client={defaultClient}>
    <ApolloHooksProvider client={defaultClient}>
      <ThemeProvider theme={themeFactory({})}>
        <AuthProvider>
          <GlobalStyle />
          <Router />
        </AuthProvider>
      </ThemeProvider>
    </ApolloHooksProvider>
  </ApolloProvider>
)

export default Root
