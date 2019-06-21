import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import cf = require('@aws-cdk/aws-cloudfront')
import targets = require('@aws-cdk/aws-events-targets')

import { WebCICDStackProps } from './interfaces'
import WebPipeline from './constructs/WebPipeline'
import WebRepository from './constructs/WebRepository'
import WebBuildProject from './constructs/WebBuildProject'

export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WebCICDStackProps) {
    super(scope, id)

    const { buildSpec, projectName } = props

    const repository = new WebRepository(this, `${projectName}-web-repository-construct`, {projectName}).entity

    new cdk.CfnOutput(this, `${projectName}-web-repository-ssh-url`, {
      value: repository.repositoryCloneUrlSsh,
      description: `The SSH URL for cloning the ${projectName} web repository`
    })

    this.buckets = {}
    this.buckets['staging'] = this.makeBucket(this, projectName, 'staging')
    this.buckets['production'] = this.makeBucket(this, projectName, 'production')

    this.makeCFDistribution(this, projectName, this.buckets.production)

    const project = new WebBuildProject(this, `${projectName}-web-build-construct`, {
      buildSpec,
      repository,
      projectName
    }).entity

    new WebPipeline(this, `${projectName}-web-pipeline-construct`, {
      project,
      repository,
      buckets: this.buckets,
      projectName
    }).entity

    repository.onCommit(`${projectName}-trigger-web-build`, {
      target: new targets.CodeBuildProject(project)
    })
  }
  private buckets: {
    [stage: string]: s3.IBucket
  }

  private makeBucket(stack: cdk.Stack, projectName: string, stage: string) {
    return new s3.Bucket(stack, `${projectName}-web-${stage}-bucket`, {
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

  private makeCFDistribution(stack: cdk.Stack, projectName: string, s3BucketSource: s3.IBucket) {
    return new cf.CloudFrontWebDistribution(stack, `${projectName}-web-cf-distibution`, {
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