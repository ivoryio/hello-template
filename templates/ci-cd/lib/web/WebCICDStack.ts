import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import cf = require('@aws-cdk/aws-cloudfront')
import route53 = require('@aws-cdk/aws-route53')
import route53Targets = require('@aws-cdk/aws-route53-targets')

import WebPipeline from './constructs/WebPipeline'
import WebRepository from './constructs/WebRepository'
import WebBuildProject from './constructs/WebBuildProject'
import { HostedZone } from '@aws-cdk/aws-route53'
import { IRepository } from '@aws-cdk/aws-codecommit'

export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    const repository = this.createRepository()

    const { stagingBucket, productionBucket } = this.createPipeline(repository)

    const stagingDist = this.createCFDistribution(stagingBucket, 'staging')
    const productionDist = this.createCFDistribution(
      productionBucket,
      'production'
    )

    if (process.env.HOSTED_ZONE_ID && process.env.APP_DOMAIN_NAME) {
      const stagingRecordName = `app.staging`
      const productionRecordName = `app`

      this.createAlias(stagingRecordName, stagingDist, 'staging')
      this.createAlias(productionRecordName, productionDist, 'production')
    }

    this.createStackOutputs(repository)
  }

  private createRepository() {
    const id = `${this.projectName}-web-repository`
    return new WebRepository(this, id).entity
  }

  private createPipeline(repository: IRepository) {
    const id = `${this.projectName}-web-pipeline`
    const stagingBucket = this.makeBucket('staging')
    const productionBucket = this.makeBucket('production')
    new WebPipeline(this, id, {
      repository,
      buckets: {
        staging: stagingBucket,
        production: productionBucket
      },
      buildProjects: {
        staging: this.createBuildProject(repository, 'staging'),
        production: this.createBuildProject(repository, 'production')
      }
    }).entity

    return { stagingBucket, productionBucket }
  }

  private makeBucket(env: 'staging' | 'production') {
    return new s3.Bucket(this, `${this.projectName}-web-${env}`, {
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

  private createBuildProject(repo: IRepository, env: 'staging' | 'production') {
    const id = `${this.projectName}-web-build-${env}`
    const props = { repository: repo, env }
    const buildProject = new WebBuildProject(this, id, props).entity

    buildProject.role!.attachManagedPolicy(
      'arn:aws:iam::aws:policy/AmazonSSMFullAccess'
    )

    return buildProject
  }

  private createCFDistribution(
    s3BucketSource: s3.IBucket,
    env: 'staging' | 'production'
  ) {
    const id = `${this.projectName}-web-cf-${env}`
    const props : cf.CloudFrontWebDistributionProps = {
      errorConfigurations: [{
        errorCode: 403,
        responseCode: 200,
        responsePagePath: '/index.html'
      }],
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource
          },
          behaviors: [
            {
              isDefaultBehavior: true
            }
          ]
        }
      ]
    }

    return new cf.CloudFrontWebDistribution(this, id, props)
  }

  private createAlias(
    recordName: string,
    distibution: cf.CloudFrontWebDistribution,
    env: 'staging' | 'production'
  ) {
    const hostedZoneId = process.env.HOSTED_ZONE_ID!
    const id = `${this.projectName}-zone-${env}`
    const props = {
      hostedZoneId,
      zoneName: 'ivory.io'
    }
    const zone = HostedZone.fromHostedZoneAttributes(this, id, props)
    const target = route53.AddressRecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distibution)
    )

    new route53.ARecord(this, `${recordName}`, { recordName, zone, target })
  }

  private createStackOutputs(repository: IRepository) {
    new cdk.CfnOutput(this, `repository-ssh-url`, {
      value: repository.repositoryCloneUrlSsh,
      description: `The SSH URL for cloning the ${
        this.projectName
      } web repository`
    })
  }

  private readonly projectName = process.env.PROJECT_NAME!
}
