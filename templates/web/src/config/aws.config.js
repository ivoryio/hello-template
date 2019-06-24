/* eslint-disable */
import Amplify from 'aws-amplify'

export default Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
  },
  aws_appsync_graphqlEndpoint:
    process.env.REACT_APP_AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.REACT_APP_AWS_APPSYNC_REGION,
  aws_appsync_authenticationType:
    process.env.REACT_APP_AWS_APPSYNC_AUTHENTICATION_TYPE,
  API: {
    graphql_headers: async () => ({})
  },
  Analytics: {
    disabled: true
  }
})
