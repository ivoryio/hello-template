import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import cf = require('@aws-cdk/aws-cloudfront')
import targets = require('@aws-cdk/aws-events-targets')

import { WebCICDStackProps } from './interfaces'
import WebRepository from './constructs/WebRepository'
import WebBuildProject from './constructs/WebBuildProject'


export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WebCICDStackProps) {
    super(scope, id)

    const { serviceName, buildSpec } = props

    const repository = new WebRepository(this, `${serviceName}-web-repository-construct`, {
      serviceName
    }).entity

    const stagingBucket = this.makeBucket(this, 'staging')
    const productionBucket = this.makeBucket(this, 'production')

    this.makeCFDistribution(this, serviceName, productionBucket)

    const project = new WebBuildProject(this, `${serviceName}-web-build-construct`, {
      buildSpec,
      repository,
      serviceName
    }).entity

    repository.onCommit(`trigger-${serviceName}-web-build`, {
      target: new targets.CodeBuildProject(project)
    })
  }

  private makeBucket(stack: cdk.Stack, stage: string) {
    return new s3.Bucket(stack, `web-${stage}-bucket`, {
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    })
  }

  private makeCFDistribution(stack: cdk.Stack, serviceName: string, s3BucketSource: s3.IBucket) {
    return new cf.CloudFrontWebDistribution(stack, `${serviceName}-web-cf-distibution`, {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    })
  }
}