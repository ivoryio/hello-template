import gql from 'graphql-tag'

export const GET_GREETING = gql`
  query($name: String!) {
    greeting(name: $name) {
      id
      text
    }
  }
`
