require('chai').should()

const getGreeting = require('../../src/usecases/getGreeting')

const retrieveAllGreetings = async () => {
  return await Promise.resolve([
    {
      id: '2745fea3-a10a-4827-a8ca-ac5b443602ed',
      text: 'Hello'
    }
  ])
}

describe('Get greeting usecase', () => {
  it('should return a greeting', async () => {
    const name = 'Ioana'
    const greeting = await getGreeting(retrieveAllGreetings)(name)

    assertId(greeting)
    greeting.should.have.property('text', `Hello ${name}`)
  })

  it('should return a greeting with default name, if name is missing', async () => {
    const greeting = await getGreeting(retrieveAllGreetings)()

    assertId(greeting)
    greeting.should.have.property('text', 'Hello John Doe')
  })
})

function assertId(greeting) {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  greeting.should.have.property('id')
  greeting.id.should.match(uuidRegex)
}
