/* eslint-disable */
import Amplify from 'aws-amplify'

export default Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_bgRfDvBOK',
    userPoolWebClientId: '5encj2aqvrkcdohucih5aan743'
  },
  aws_appsync_graphqlEndpoint:
    'https://j4wy5aooxbdtrf6vir7u575rua.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  API: {
    graphql_headers: async () => ({})
  }
})
