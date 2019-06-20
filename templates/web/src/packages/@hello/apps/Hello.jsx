import React, { useEffect, useState } from 'react'
import Typography from '@kogaio/Typography'
import api from '../services/api.dataservice'

const Hello = props => {
  const [joke, setJoke] = useState('Loading...')

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
  return (
    <Typography textAlign='center' {...props}>
      {joke}
    </Typography>
  )
}

export default Hello
