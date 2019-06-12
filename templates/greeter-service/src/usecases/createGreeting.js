const uuidv4 = require('uuid/v4')

module.exports = persistGreeting =>
  async function(greetingText) {
    try {
      validateInput()

      const greeting = createGreeting()
      await persistGreeting(greeting)
      return greeting
    } catch (err) {
      throw err
    }

    function validateInput() {
      if(!greetingText) {
        throw new Error('MissingParameter: greetingText is required')
      }
    }

    function createGreeting() {
      return {
        id: uuidv4(),
        greeting: greetingText
      }
    }
  }
