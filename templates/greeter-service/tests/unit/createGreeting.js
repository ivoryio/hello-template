const should = require('chai').should()

const createGreeting = require('../../src/usecases/createGreeting')

const persistGreeting = async () => {
  await Promise.resolve()
}

describe('Create greeting usecase', () => {
  it('should create a greeting when passing the correct data', async () => {
    const greetingText = 'Hello'
    const greeting = await createGreeting(persistGreeting)(greetingText)

    assertId(greeting)
    greeting.should.have.property('text', 'Hello')
  })

  it('should throw an error when creating a greeting without text', async () => {
    try {
      await createGreeting(persistGreeting)()
      throw new Error('createGreeting did not thrown an error')
    } catch (err) {
      should.exist(err)
      err.message.should.match(/^MissingParameter/)
    }
  })
})

function assertId(greeting) {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  greeting.should.have.property('id')
  greeting.id.should.match(uuidRegex)
}
