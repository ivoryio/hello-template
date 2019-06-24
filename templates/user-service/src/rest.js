const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpress = require('aws-serverless-express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const retrieveMessage = require('./repository/retrieveMessage')
const getServiceMessage = require('./usecases/getServiceMessage')

const app = express()
const router = express.Router()

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())

router.get('/status', async (req, res) => {
  const message = await getServiceMessage(retrieveMessage)()
  res.status(200).json(message)
})

app.use('/', router)

const server = awsServerlessExpress.createServer(app)

exports.controller = (event, context) =>
  awsServerlessExpress.proxy(server, event, context)
