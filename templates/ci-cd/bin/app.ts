#!/usr/bin/env node
import 'source-map-support/register'
import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')

import WebCICDStack from '../lib/web/WebCICDStack'
import ServiceCICDStack from '../lib/services/ServiceCICDStack'

const app = new cdk.App()

createWebCICD()
createUserServiceCICD()
createDataGatewayCICD()
createGreeterServiceCICD()

function createWebCICD() {
  new WebCICDStack(app, 'web-ci-cd-stack')
}

function createUserServiceCICD() {
  new ServiceCICDStack(app, 'user-service-ci-cd-stack', {
    serviceName: 'user-service'
  })
}

function createGreeterServiceCICD() {
  new ServiceCICDStack(app, 'greeter-service-ci-cd-stack', {
    serviceName: 'greeter-service'
  })
}

function createDataGatewayCICD() {
  const makeBuildSpec = (lambdaArtifactsBucket: s3.Bucket) => ({
    version: '0.2',
    phases: {
      pre_build: {
        commands: ['mkdir -p build']
      },
      build: {
        commands: ['npm prune --production']
      },
      post_build: {
        commands: [
          `aws cloudformation package \
--template-file infrastructure.yaml \
--output-template-file build/infrastructure.packaged.yaml \
--s3-bucket ${lambdaArtifactsBucket.bucketName}`
        ]
      }
    },
    artifacts: {
      'secondary-artifacts': {
        template: {
          files: 'infrastructure.packaged.yaml',
          'base-directory': 'build'
        },
        staging_parameters: {
          files: 'staging.json',
          'base-directory': 'parameters'
        },
        production_parameters: {
          files: 'production.json',
          'base-directory': 'parameters'
        }
      }
    }
  })

  new ServiceCICDStack(app, 'data-gateway-service-ci-cd-stack', {
    serviceName: 'data-gateway-service',
    makeBuildSpec
  })
}
