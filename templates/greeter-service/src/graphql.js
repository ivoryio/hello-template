const getGreeting = require('./usecases/getGreeting')
const createGreeting = require('./usecases/createGreeting')

exports.resolver = async (event) => {
  switch(event.field) {
    case 'greeting':
      return await getGreeting()(event.arguments.name)
    case 'createGreeting':
      return await createGreeting()(event.arguments.greeting)
  }
}