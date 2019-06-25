import { useEffect, useState } from 'react'

export const useJoke = () => {
  const [joke, setJoke] = useState('Loading...')

  useEffect(() => {
    fetchRandomJoke()

    function fetchRandomJoke () {
      const joke = fetch('https://api.icndb.com/jokes/random')
        .then(response => response.json())
        .then(data => setTimeout(() => setJoke(data.value.joke), 500))
      return joke
    }
  }, [])
  return joke
}
