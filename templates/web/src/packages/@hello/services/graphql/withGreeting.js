import React, { useState } from 'react'

import { useMutation, useQuery } from 'react-apollo-hooks'

import { GET_GREETING } from './queries'
import { ADD_GREETING } from './mutations'

export const withGreeting = Component => props => {
  const [addError, setAddError] = useState(null)
  const [isAdding, setAdding] = useState(false)
  const { data, error, loading } = useQuery(GET_GREETING, {
    variables: { name: props.name } // eslint-disable-line
  })
  const requestAddGreeting = useMutation(ADD_GREETING)

  const addGreeting = async newGreeting => {
    setAdding(true)
    try {
      await requestAddGreeting({
        variables: {
          text: newGreeting
        },
        refetchQueries: [{ query: GET_GREETING }],
        awaitRefetchQueries: true
      })
    } catch (err) {
      setAddError(err)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Component
      addError={addError}
      addGreeting={addGreeting}
      greeting={data.greeting}
      error={error}
      isAdding={isAdding}
      loading={loading}
      {...props}
    />
  )
}
