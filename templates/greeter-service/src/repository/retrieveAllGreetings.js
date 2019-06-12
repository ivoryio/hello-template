const DynamoDB = require('aws-sdk/clients/dynamodb')

module.exports = async () => {
  const region = process.env.REGION
  const TableName = process.env.TABLE_NAME
  const dynamo = new DynamoDB.DocumentClient({ region })

  const params = {
    TableName
  }

  const data = await dynamo.scan(params).promise()

  return data.Items
}
