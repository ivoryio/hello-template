import React from 'react'
import ReactDOM from 'react-dom'
import Amplify from 'aws-amplify'
import awsConfig from './config/aws.config'

import Root from './app/Root'
import * as serviceWorker from './config/serviceWorker'

Amplify.configure(awsConfig)
ReactDOM.render(<Root />, document.getElementById('root'))

serviceWorker.unregister()
