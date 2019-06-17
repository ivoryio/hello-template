#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/cdk')

import services from './services'
import ServiceCICDStack from '../lib/services/ServiceCICDStack'


const app = new cdk.App()

services.forEach(service => {
  new ServiceCICDStack(app, `${service.name}-ci-cd-stack`, {
    serviceName: service.name,
    makeBuildSpec: service.makeBuildSpec
  })
})
