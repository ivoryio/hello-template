/* eslint react/prop-types: 0 */
import React, { useState } from 'react'

import { useMutation, useQuery } from 'react-apollo-hooks'

import { GET_GREETING } from './queries'
import { ADD_GREETING } from './mutations'

export const withGreeting = Component => props => {
  const [addError, setAddError] = useState(null)
  const [addingGreeting, setAddingGreeting] = useState(false)
  const { data, error, loading } = useQuery(GET_GREETING, {
    variables: { name: props.name }
  })
  const requestAddGreeting = useMutation(ADD_GREETING)

  const addGreeting = async newGreeting => {
    setAddingGreeting(true)
    try {
      await requestAddGreeting({
        variables: {
          text: newGreeting
        },
        refetchQueries: [
          { query: GET_GREETING, variables: { name: props.name } }
        ],
        awaitRefetchQueries: true
      })
    } catch (err) {
      setAddError(err)
    } finally {
      setAddingGreeting(false)
    }
  }

  return (
    <Component
      addError={addError}
      addGreeting={addGreeting}
      addingGreeting={addingGreeting}
      greeting={data.greeting}
      error={error}
      loading={loading}
      {...props}
    />
  )
}
