import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import cf = require('@aws-cdk/aws-cloudfront')
import targets = require('@aws-cdk/aws-events-targets')

import { WebCICDStackProps } from './interfaces'
import WebRepository from './constructs/WebRepository'
import WebBuildProject from './constructs/WebBuildProject'
import WebPipeline from './constructs/WebPipeline'


export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WebCICDStackProps) {
    super(scope, id)

    const { buildSpec } = props

    const repository = new WebRepository(this, `web-repository-construct`, {}).entity

    this.buckets = {}
    this.buckets['staging'] = this.makeBucket(this, 'staging')
    this.buckets['production'] = this.makeBucket(this, 'production')

    this.makeCFDistribution(this, this.buckets.production)

    const project = new WebBuildProject(this, `web-build-construct`, {
      buildSpec,
      repository
    }).entity

    new WebPipeline(this, `web-pipeline-construct`, {
      project,
      repository,
      buckets: this.buckets
    }).entity

    repository.onCommit(`trigger-web-build`, {
      target: new targets.CodeBuildProject(project)
    })
  }
  private buckets: {
    [stage: string]: s3.IBucket
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

  private makeCFDistribution(stack: cdk.Stack, s3BucketSource: s3.IBucket) {
    return new cf.CloudFrontWebDistribution(stack, `web-cf-distibution`, {
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