import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import cf = require('@aws-cdk/aws-cloudfront')
import targets = require('@aws-cdk/aws-events-targets')
import iam = require('@aws-cdk/aws-iam')

import { WebCICDStackProps } from './interfaces'
import WebPipeline from './constructs/WebPipeline'
import WebRepository from './constructs/WebRepository'
import WebBuildProject from './constructs/WebBuildProject'

export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: WebCICDStackProps) {
    super(scope, id)

    const { buildSpec, projectName } = props

    const repository = new WebRepository(
      this,
      `${projectName}-web-repository`,
      { projectName }
    ).entity

    new cdk.CfnOutput(this, `repository-ssh-url`, {
      value: repository.repositoryCloneUrlSsh,
      description: `The SSH URL for cloning the ${projectName} web repository`
    })

    const buckets: {
      [stage: string]: s3.IBucket
    } = {}

    buckets['staging'] = this.makeBucket(this, projectName, 'staging')
    buckets['production'] = this.makeBucket(this, projectName, 'production')

    const stagingBuildProject = new WebBuildProject(
      this,
      `${projectName}-web-build-staging`,
      {
        buildSpec,
        repository,
        projectName,
        env: 'staging'
      }
    ).entity
    stagingBuildProject.role!.attachManagedPolicy('arn:aws:iam::aws:policy/AmazonSSMFullAccess')

    const productionBuildProject = new WebBuildProject(
      this,
      `${projectName}-web-build-production`,
      {
        buildSpec,
        repository,
        projectName,
        env: 'production'
      }
    ).entity
    productionBuildProject.role!.attachManagedPolicy('arn:aws:iam::aws:policy/AmazonSSMFullAccess')

    new WebPipeline(this, `${projectName}-web-pipeline`, {
      repository,
      projectName,
      buckets: buckets,
      stagingBuildProject,
      productionBuildProject
    }).entity
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
      websiteErrorDocument: 'index.html'
    })
  }
}
