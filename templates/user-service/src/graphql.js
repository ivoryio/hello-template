const retrieveMessage = require('./repository/retrieveMessage')
const getServiceMessage = require('./usecases/getServiceMessage')

exports.resolver = async event => {
  switch (event.field) {
    case 'message':
      return await getServiceMessage(retrieveMessage)()
  }
}
