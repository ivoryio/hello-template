require('chai').should()

const getServiceMessage = require('../../src/usecases/getServiceMessage')

const retrieveMessage = async () => {
  return await Promise.resolve({
    id: '1',
    message: 'Up and running!'
  })
}

describe('Get service message usecase', () => {
  it('should return the service message', async () => {
    const greeting = await getServiceMessage(retrieveMessage)()

    greeting.should.have.property('id', '1')
    greeting.should.have.property('timestamp')
    greeting.should.have.property('message', `Up and running!`)
  })
})
