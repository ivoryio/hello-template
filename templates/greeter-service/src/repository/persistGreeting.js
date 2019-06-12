const DynamoDB = require('aws-sdk/clients/dynamodb')

module.exports = async (greeting) => {
  const region = process.env.REGION
  const TableName = process.env.TABLE_NAME
  const dynamo = new DynamoDB.DocumentClient({ region })

  const params = {
    TableName,
    Item: greeting
  }

  await dynamo.put(params).promise()
}

