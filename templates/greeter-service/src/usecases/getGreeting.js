module.exports = retrieveAllGreetings =>
  async function(name) {
    try {
      const greetings = await retrieveAllGreetings()
      const greeting = greetings[getRandomInt(greetings.length)]
      return {
        id: greeting.id,
        text:`${greeting.text} ${name ? name : 'John Doe'}`}
    } catch (err) {
      throw err
    }

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    }
  }
