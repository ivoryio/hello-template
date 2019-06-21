import React from 'react'
import ReactDOM from 'react-dom'
import { UserMenuEntry } from '../components/UserMenuEntry'

const mockedData = {
  user: {
    attributes: {
      name: 'Name',
      'family_name': 'Family'
    }
  }
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<UserMenuEntry regionData={mockedData} />, div)
  ReactDOM.unmountComponentAtNode(div)
})
