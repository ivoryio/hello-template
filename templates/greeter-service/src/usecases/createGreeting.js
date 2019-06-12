const uuidv4 = require('uuid/v4')

module.exports = persistGreeting =>
  async function(text) {
    try {
      validateInput()

      const greeting = createGreeting()
      await persistGreeting(greeting)
      return greeting
    } catch (err) {
      throw err
    }

    function validateInput() {
      if(!text) {
        throw new Error('MissingParameter: text is required')
      }
    }

    function createGreeting() {
      return {
        text,
        id: uuidv4()
      }
    }
  }
