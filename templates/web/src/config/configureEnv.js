const fs = require('fs')
const AWS = require('aws-sdk')

var ssm = new AWS.SSM({ apiVersion: '2014-11-06', region: 'us-east-1' })

const appParameters = [
  {
    ssm: `${process.env.PROJECT_NAME}-user-service-pool-id-${process.env.ENVIRONMENT}`,
    react: ['REACT_APP_USER_POOL_ID']
  },
  {
    ssm: `${process.env.PROJECT_NAME}-user-service-web-client-id-${process.env.ENVIRONMENT}`,
    react: ['REACT_APP_USER_POOL_WEB_CLIENT_ID']
  },
  {
    ssm: `${process.env.PROJECT_NAME}-data-gateway-url-${process.env.ENVIRONMENT}`,
    react: ['REACT_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT']
  }
]

validateEnvironment()
  .then(retrieveSSMParameters)
  .then(configureReactParameters)
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

function validateEnvironment () {
  const { ENVIRONMENT } = process.env
  if (ENVIRONMENT !== 'staging' && ENVIRONMENT !== 'production') {
    return Promise.reject(
      `Expecting ENVIRONMENT to be staging or production, got: ${
        process.env.ENVIRONMENT
      }`
    )
  }

  return Promise.resolve()
}

function retrieveSSMParameters () {
  const params = {
    Names: appParameters.map(p => p.ssm)
  }

  return ssm
    .getParameters(params)
    .promise()
    .then(data => {
      if (data.InvalidParameters.length > 0) {
        return Promise.reject(
          `Invalid parameters: ${data.InvalidParameters.join(' ; ')}`
        )
      }

      return data.Parameters
    })
}

function configureReactParameters (ssmParameters) {
  const { ENVIRONMENT } = process.env
  let envRC = JSON.parse(fs.readFileSync('.env-cmdrc'))

  ssmParameters.forEach(ssmParameter => {
    const appParam = appParameters.find(p => p.ssm === ssmParameter.Name)
    appParam.react.forEach(
      reactParam =>
        (envRC[ENVIRONMENT] = {
          ...envRC[ENVIRONMENT],
          [reactParam]: ssmParameter.Value
        })
    )
  })
  return fs.writeFileSync('.env-cmdrc', JSON.stringify(envRC, null, 2))
}
