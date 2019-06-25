module.exports = retrieveAllGreetings =>
  async function(name) {
    try {
      const greetings = await retrieveAllGreetings()

      const noGreetings = greetings.length === 0
      if (noGreetings) {
        return defaultGreeting(name)
      }
      return randomGreeting(greetings, name)
    } catch (err) {
      throw err
    }
  }

function defaultGreeting(name) {
  return {
    id: '',
    text: `Hello ${name}`
  }
}

function randomGreeting(greetings, name) {
  const greeting = greetings[getRandomInt(greetings.length)]
  return {
    id: greeting.id,
    text: `${greeting.text} ${name ? name : 'John Doe'}`
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}
