import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Input from '@kogaio/Input'
import Button from '@kogaio/Button'
import Typography from '@kogaio/Typography'
import { Flex, Space } from '@kogaio/Responsive'

import api from '../services/api.dataservice'
import { withGreeting } from '@hello/services/graphql/withGreeting'
import ActivityIndicator from '@ivoryio/kogaio/ActivityIndicator'

const Hello = ({ addGreeting, loading, greeting, ...props }) => {
  const [joke, setJoke] = useState('Loading...')
  const [newGreeting, storeNewGreeting] = useState('')

  useEffect(() => {
    fetchRandomJoke()
    function fetchRandomJoke () {
      api
        .getRandomJoke()
        .then(response => response.json())
        .then(data =>
          setTimeout(() => {
            setJoke(data.value.joke)
          }, 500)
        )
    }
  }, [])

  const _handleValueChange = ev => storeNewGreeting(ev.target.value)
  const _sendNewGreeting = () =>
    addGreeting(newGreeting).then(() => storeNewGreeting(''))

  return (
    <Flex alignItems='center' flexDirection='column' justifyContent='center'>
      <Typography textAlign='center' variant='h3' {...props}>
        {loading ? <ActivityIndicator /> : <Typography>{greeting.text}</Typography>}
      </Typography>
      <Space mt={2}>
        <Typography variant='h5'>Fun fact:</Typography>
        <Typography variant='paragraph'>{joke}</Typography>
      </Space>
      <Space mt={4}>
        <Flex justifyContent='center'>
          <Space mx={1}>
            <Input
              onChange={_handleValueChange}
              placeholder='New greeting'
              value={newGreeting}
            />
            <Button height='36px' onClick={_sendNewGreeting} title='Save' />
          </Space>
        </Flex>
      </Space>
    </Flex>
  )
}

Hello.propTypes = {
  addGreeting: PropTypes.func,
  loading: PropTypes.bool,
  greeting: PropTypes.shape({
    text: PropTypes.string,
    id: PropTypes.string,
    __typename: PropTypes.string
  })
}

export default withGreeting(Hello)
