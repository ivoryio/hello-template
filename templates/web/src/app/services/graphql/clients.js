import { Auth } from 'aws-amplify'
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync'
import awsconfig from 'config/aws.config'

export const defaultClient = new AWSAppSyncClient({
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () =>
      (await Auth.currentSession()).getIdToken().getJwtToken()
  },
  disableOffline: true
})
