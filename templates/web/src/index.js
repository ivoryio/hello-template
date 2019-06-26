import React from 'react'
import ReactDOM from 'react-dom'

import Root from './app/Root'
import * as serviceWorker from './config/serviceWorker'

import('./config/aws.config')

ReactDOM.render(<Root />, document.getElementById('root'))

serviceWorker.unregister()
