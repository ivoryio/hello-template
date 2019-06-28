import cdk = require('@aws-cdk/cdk')
import s3 = require('@aws-cdk/aws-s3')
import iam = require('@aws-cdk/aws-iam')
import ssm = require('@aws-cdk/aws-ssm')
import cf = require('@aws-cdk/aws-cloudfront')
import route53 = require('@aws-cdk/aws-route53')
import { HostedZone } from '@aws-cdk/aws-route53'
import { IRepository } from '@aws-cdk/aws-codecommit'

import route53Targets = require('@aws-cdk/aws-route53-targets')

import WebPipeline from './constructs/WebPipeline'
import WebRepository from './constructs/WebRepository'
import WebBuildProject from './constructs/WebBuildProject'

export default class WebCICDStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    const repository = this.createRepository()

    const stagingBucket = this.makeBucket('staging')
    const productionBucket = this.makeBucket('production')

    const stagingDist = this.createCFDistribution(stagingBucket, 'staging')
    const prodDist = this.createCFDistribution(productionBucket, 'production')

    this.createDistributionParameters(stagingDist, 'staging')
    this.createDistributionParameters(prodDist, 'production')

    if (this.isDNSEnabled()) {
      this.createAlias(stagingDist, 'staging')
      this.createAlias(prodDist, 'production')
    }

    const buckets = {
      staging: stagingBucket,
      production: productionBucket
    }
    const distributions = {
      staging: stagingDist,
      production: prodDist
    }

    this.createPipeline(buckets, distributions, repository)

    this.createStackOutputs(repository)
  }
  private isDNSEnabled() {
    return (
      process.env.HOSTED_ZONE_ID &&
      process.env.APP_DOMAIN_NAME &&
      process.env.CERTIFICATE_ARN
    )
  }

  private createRepository() {
    const id = `${this.projectName}-web-repository`
    return new WebRepository(this, id).entity
  }

  private createPipeline(
    buckets: { staging: s3.IBucket; production: s3.IBucket },
    distributions: {
      staging: cf.CloudFrontWebDistribution
      production: cf.CloudFrontWebDistribution
    },
    repository: IRepository
  ) {
    const id = `${this.projectName}-web-pipeline`

    const pipeline = new WebPipeline(this, id, {
      repository,
      buckets: {
        staging: buckets.staging,
        production: buckets.production
      },
      buildProjects: {
        staging: createBuildProject(
          this,
          distributions.staging.distributionId,
          'staging'
        ),
        production: createBuildProject(
          this,
          distributions.production.distributionId,
          'production'
        )
      }
    }).entity

    return pipeline

    function createBuildProject(
      stack: WebCICDStack,
      distributionID: string,
      env: 'staging' | 'production'
    ) {
      const id = `${stack.projectName}-web-build-${env}`
      const props = { repository, env, distributionID }
      const buildProject = new WebBuildProject(stack, id, props).entity

      buildProject.role!.attachInlinePolicy(
        createCFDistributionInvalidationPolicy()
      )
      buildProject.role!.attachInlinePolicy(createSSMRetrieveParametersPolicy())

      return buildProject

      function createCFDistributionInvalidationPolicy() {
        return new iam.Policy(stack, `${env}-cf-invalidation-policy`, {
          statements: [
            new iam.PolicyStatement()
              .addAllResources()
              .addAction('cloudfront:CreateInvalidation')
          ]
        })
      }

      function createSSMRetrieveParametersPolicy() {
        return new iam.Policy(stack, `${env}-ssm-retrieve-parameters-policy`, {
          statements: [
            new iam.PolicyStatement()
              .addActions('ssm:GetParameters', 'ssm:GetParameter')
              .addAllResources()
          ]
        })
      }
    }
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

  private createCFDistribution(
    s3BucketSource: s3.IBucket,
    env: 'staging' | 'production'
  ) {
    const id = `${this.projectName}-web-cf-${env}`
    const aliasNames =
      env === 'staging'
        ? [`staging.${process.env.APP_DOMAIN_NAME}`]
        : [`app.${process.env.APP_DOMAIN_NAME}`]
    const props: cf.CloudFrontWebDistributionProps = {
      aliasConfiguration: process.env.CERTIFICATE_ARN
        ? {
            acmCertRef: process.env.CERTIFICATE_ARN!,
            names: aliasNames
          }
        : undefined,
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html'
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html'
        }
      ],
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
    distibution: cf.CloudFrontWebDistribution,
    env: 'staging' | 'production'
  ) {
    const hostedZoneId = process.env.HOSTED_ZONE_ID!
    const id = `${this.projectName}-zone-${env}`
    const props = {
      hostedZoneId,
      zoneName: process.env.APP_DOMAIN_NAME!
    }
    const zone = HostedZone.fromHostedZoneAttributes(this, id, props)
    const target = route53.AddressRecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(distibution)
    )

    const recordName = env === 'staging' ? 'staging' : 'app'
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

  private createDistributionParameters(
    distribution: cf.CloudFrontWebDistribution,
    env: 'staging' | 'production'
  ) {
    new ssm.StringParameter(this, `${this.projectName}-cf-dns-${env}`, {
      name: `${this.projectName}-cf-dns-${env}`,
      stringValue: distribution.domainName,
      description: `The CloudFront Web distribution DNS for ${env}`
    })
  }

  private readonly projectName = process.env.PROJECT_NAME!
}
