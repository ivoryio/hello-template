const should = require('chai').should()

const createGreeting = require('../../src/usecases/createGreeting')

describe('Create greeting usecase', () => {
  it('should create a greeting when passing the correct data', async () => {
    const greetingText = 'Hello'
    const persistGreeting = async () => {
      await Promise.resolve()
    }

    const greeting = await createGreeting(persistGreeting)(greetingText)

    should.exist(greeting)
    assertId()
    assertGreeting()

    function assertId() {
      greeting.should.have.property('id')
      greeting.id.should.match(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      )
    }
    function assertGreeting() {
      greeting.should.have.property('greeting')
      greeting.greeting.should.equal('Hello')
    }
  })

  it('should throw an error when creating a greeting without text', async () => {
    const greetingText = ''
    const persistGreeting = async greeting => {
      await Promise.resolve()
    }

    try {
      await createGreeting(persistGreeting)(greetingText)
      throw new Error('createGreeting did not thrown an error')
    } catch (err) {
      should.exist(err)
      err.message.should.match(/^MissingParameter/)
    }
  })
})
