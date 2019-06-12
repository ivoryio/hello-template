const getGreeting = require('./usecases/getGreeting')
const createGreeting = require('./usecases/createGreeting')

exports.resolver = async (event) => {
  switch(event.field) {
    case 'greeting':
      const { name } =  event.arguments
      return await getGreeting()(name)
    case 'createGreeting':
      const { greeting } = event.arguments
      return await createGreeting()(greeting)
  }
}