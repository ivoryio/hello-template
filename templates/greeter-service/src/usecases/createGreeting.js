module.exports = () =>
  async function(name) {
    try {
      const greetings = ['Hello', 'Hey', 'Salut']
      const greeting = greetings[getRandomInt(greetings.length)]

      return `${greeting} ${name}`
    } catch (err) {
      throw err
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    }
  }
