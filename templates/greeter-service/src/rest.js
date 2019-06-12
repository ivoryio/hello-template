const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpress = require('aws-serverless-express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const getGreeting = require('./usecases/getGreeting')
const createGreeting = require('./usecases/createGreeting')

const persistGreeting = require('./repository/persistGreeting')
const retrieveAllGreetings = require('./repository/retrieveAllGreetings')

const app = express()
const router = express.Router()

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())

router.get('/greeting', async (req, res) => {
  const greeting = await getGreeting(retrieveAllGreetings)(req.query.name)
  res.status(200).json({ greeting })
})

router.post('/greeting', async (req, res) => {
  const greeting = await createGreeting(persistGreeting)(req.body.greeting)

  console.log(greeting)
  res.status(201).json(greeting)
})

app.use('/', router)

const server = awsServerlessExpress.createServer(app)

exports.controller = (event, context) =>
  awsServerlessExpress.proxy(server, event, context)
