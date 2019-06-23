#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/cdk')

import services from './services'
import WebCICDStack from '../lib/web/WebCICDStack'
import ServiceCICDStack from '../lib/services/ServiceCICDStack'

const app = new cdk.App()

const projectName = process.env.PROJECT_NAME!
if (!projectName) {
  console.error('Missing env PROJECT_NAME')
  process.exit(1)
}

createWebCICD()
createServicesCICD()

function createWebCICD() {
  new WebCICDStack(app, `${projectName}-web-ci-cd`, { projectName })
}

function createServicesCICD() {
  services.forEach(service => {
    new ServiceCICDStack(app, `${projectName}-${service.name}-ci-cd`, {
      projectName,
      serviceName: service.name,
      makeBuildSpec: service.makeBuildSpec
    })
  })
}
