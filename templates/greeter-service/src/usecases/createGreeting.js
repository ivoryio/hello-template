const uuidv4 = require('uuid/v4')

module.exports = persistGreeting =>
  async function(greetingText) {
    try {
      const greeting = createGreeting()
      await persistGreeting(greeting)
      return greeting
    } catch (err) {
      throw err
    }

    function createGreeting() {
      return {
        id: uuidv4(),
        greeting: greetingText
      }
    }
  }
