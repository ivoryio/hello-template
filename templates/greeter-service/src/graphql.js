const persistGreeting = require('./repository/persistGreeting')
const retrieveAllGreetings = require('./repository/retrieveAllGreetings')

const getGreeting = require('./usecases/getGreeting')
const createGreeting = require('./usecases/createGreeting')


exports.resolver = async (event) => {
  switch(event.field) {
    case 'greeting':
      return await getGreeting(retrieveAllGreetings)(event.arguments.name)
    case 'createGreeting':
      return await createGreeting(persistGreeting)(event.arguments.text)
  }
}