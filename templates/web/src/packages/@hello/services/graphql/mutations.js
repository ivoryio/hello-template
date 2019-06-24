import gql from 'graphql-tag'

export const ADD_GREETING = gql`
  mutation($text: String!) {
    addGreeting(text: $text) {
      id
      text
    }
  }
`
