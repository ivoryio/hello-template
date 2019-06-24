#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/cdk')

import services from './services'
import CICDStack from '../lib/CICDStack'
import WebCICDStack from '../lib/web/WebCICDStack'
import ServiceCICDStack from '../lib/services/ServiceCICDStack'

const app = new cdk.App()

const projectName = process.env.PROJECT_NAME!
if (!projectName) {
  console.error('Missing env PROJECT_NAME')
  process.exit(1)
}

createCICDStack()
createWebCICDStack()
createServicesCICDStack()

function createCICDStack() {
  new CICDStack(app, `${projectName}-ci-cd`)
}

function createWebCICDStack() {
  new WebCICDStack(app, `${projectName}-web-ci-cd`)
}

function createServicesCICDStack() {
  services.forEach(service => {
    new ServiceCICDStack(app, `${projectName}-${service.name}-ci-cd`, {
      projectName,
      serviceName: service.name,
      makeBuildSpec: service.makeBuildSpec
    })
  })
}
